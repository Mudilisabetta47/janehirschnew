import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { quote } from "@/lib/checkout/pricing";
import { createToken } from "@/lib/contact/token";
import { handleCheckout } from "@/lib/checkout/handler";
import { handleStripeWebhook } from "@/lib/checkout/webhook";
import { buildBookingMessage } from "@/lib/checkout/booking-mail";
import { services } from "@/content/services";

const req = (body: unknown, extra: Record<string, string> = {}) =>
  new Request("https://a.de/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "https://a.de", host: "a.de", ...extra },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const SECRET = "x".repeat(40);
const fakeStripe = () => {
  const create = vi.fn<(p: Stripe.Checkout.SessionCreateParams) => Promise<{ url: string }>>(async () => ({ url: "https://checkout.stripe.com/c/pay/cs_test_123" }));
  const customer = vi.fn<(p: Stripe.CustomerCreateParams) => Promise<{ id: string }>>(async () => ({ id: "cus_123" }));
  return {
    create,
    customer,
    stripe: { checkout: { sessions: { create } }, customers: { create: customer } } as unknown as Pick<Stripe, "checkout" | "customers">,
  };
};

/** Gültige Buchungsdaten inkl. Zeit-Token (10 s alt). */
const valid = (over: Record<string, unknown> = {}) => ({
  slug: "einzelcoaching",
  quantity: 1,
  firstName: "Anna",
  lastName: "Beispiel",
  company: "",
  street: "Musterweg 1",
  zip: "28844",
  city: "Weyhe",
  email: "Anna@Example.com",
  phone: "",
  vatId: "",
  wish: "",
  accepted: true,
  website: "",
  token: createToken(SECRET, Date.now() - 10_000),
  ...over,
});

beforeEach(() => {
  (globalThis as { __checkoutLimiter?: unknown }).__checkoutLimiter = undefined;
  process.env.CHECKOUT_RATE_MAX = "50";
  process.env.FORM_SECRET = SECRET;
  delete process.env.STRIPE_SECRET_KEY;
});

describe("Preisberechnung", () => {
  it("rechnet Netto → Brutto mit 19 % MwSt. und summiert korrekt", () => {
    const q = quote({ netCents: 89900, unit: "x", maxQuantity: 5 }, 2);
    expect(q.unitGrossCents).toBe(106981);
    expect(q.grossCents).toBe(213962);
    expect(q.netCents).toBe(179800);
    expect(q.vatCents + q.netCents).toBe(q.grossCents);
  });
  it("hinterlegte Nettopreise entsprechen den bestätigten Preisen", () => {
    const net = Object.fromEntries(services.filter((s) => s.booking).map((s) => [s.slug, s.booking!.netCents]));
    expect(net).toEqual({ einzelcoaching: 89900, gruppencoaching: 89900, saloncoaching: 120000, "watch-and-learn": 44900 });
  });
  it("Braut-Make-up und Online-Coaching sind (noch) nicht online buchbar", () => {
    expect(services.find((s) => s.slug === "online-coaching")?.booking).toBeUndefined();
    expect(services.find((s) => s.slug === "braut-make-up-coaching")?.booking).toBeUndefined();
  });
});

describe("handleCheckout", () => {
  it("antwortet ohne Stripe-Schlüssel mit 503 (kein Absturz)", async () => {
    expect((await handleCheckout(req(valid()))).status).toBe(503);
  });
  it("legt Kunde mit Name und Anschrift an und erstellt die Sitzung mit serverseitigem Betrag", async () => {
    const { create, customer, stripe } = fakeStripe();
    const res = await handleCheckout(req(valid({ slug: "gruppencoaching", quantity: 2, company: "Salon Test", vatId: "de123456789" })), { stripe });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, url: "https://checkout.stripe.com/c/pay/cs_test_123" });
    expect(customer.mock.calls[0]![0]).toMatchObject({
      name: "Salon Test",
      email: "anna@example.com",
      address: { line1: "Musterweg 1", postal_code: "28844", city: "Weyhe", country: "DE" },
      metadata: { first_name: "Anna", last_name: "Beispiel", vat_id: "DE123456789" },
    });
    const p = create.mock.calls[0]![0];
    expect(p.customer).toBe("cus_123");
    expect(p.line_items?.[0]).toMatchObject({ quantity: 2, price_data: { currency: "eur", unit_amount: 106981 } });
    expect(p.metadata).toMatchObject({ slug: "gruppencoaching", quantity: "2", net_cents: "179800", name: "Anna Beispiel", company: "Salon Test" });
    expect(p.success_url).toContain("{CHECKOUT_SESSION_ID}");
  });
  it("nutzt ohne Firma den vollständigen Namen", async () => {
    const { customer, stripe } = fakeStripe();
    await handleCheckout(req(valid()), { stripe });
    expect(customer.mock.calls[0]![0].name).toBe("Anna Beispiel");
  });
  it("ignoriert Preisangaben des Clients", async () => {
    const { create, stripe } = fakeStripe();
    await handleCheckout(req(valid({ amount: 1, price: 1, unit_amount: 1 })), { stripe });
    expect(create.mock.calls[0]![0].line_items?.[0]).toMatchObject({ price_data: { unit_amount: 106981 } });
  });
  it.each<[Record<string, unknown>, string]>([
    [{ slug: "online-coaching" }, "nicht buchbares Angebot"],
    [{ quantity: 2 }, "zu große Menge"],
    [{ accepted: false }, "AGB nicht akzeptiert"],
    [{ quantity: -1 }, "negative Menge"],
    [{ quantity: 1.5 }, "Kommazahl"],
    [{ firstName: "" }, "Vorname fehlt"],
    [{ lastName: "A" }, "Nachname zu kurz"],
    [{ street: "" }, "Straße fehlt"],
    [{ zip: "123" }, "PLZ ungültig"],
    [{ city: "" }, "Ort fehlt"],
    [{ email: "keine-mail" }, "E-Mail ungültig"],
    [{ vatId: "FR123" }, "USt-IdNr. ungültig"],
  ])("lehnt %j ab (%s)", async (over) => {
    const { create, customer, stripe } = fakeStripe();
    const res = await handleCheckout(req(valid(over)), { stripe });
    expect(res.status).toBe(422);
    expect(create).not.toHaveBeenCalled();
    expect(customer).not.toHaveBeenCalled();
  });
  it("liefert Feldfehler pro Feld", async () => {
    const { stripe } = fakeStripe();
    const res = await handleCheckout(req(valid({ firstName: "", zip: "1" })), { stripe });
    expect(res.body.ok === false && res.body.fieldErrors).toMatchObject({ firstName: expect.any(String), zip: expect.any(String) });
  });
  it("entfernt Steuerzeichen aus Name und Adresse", async () => {
    const { customer, stripe } = fakeStripe();
    await handleCheckout(req(valid({ firstName: "An\nna\r", street: "Weg\u0000 1" })), { stripe });
    const c = customer.mock.calls[0]![0];
    expect(JSON.stringify(c)).not.toMatch(/\\n|\\r|\\u0000/);
    expect(c.individual_name).toBe("Anna Beispiel");
  });
  it("lehnt Honeypot, zu schnelles und gefälschtes Token ab", async () => {
    const { create, stripe } = fakeStripe();
    expect((await handleCheckout(req(valid({ website: "http://spam" })), { stripe })).status).toBe(400);
    expect((await handleCheckout(req(valid({ token: createToken(SECRET, Date.now()) })), { stripe })).status).toBe(400);
    expect((await handleCheckout(req(valid({ token: createToken("falsch".repeat(8), Date.now() - 10_000) })), { stripe })).status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });
  it("lehnt fremde Herkunft, falschen Typ und kaputtes JSON ab", async () => {
    const { stripe } = fakeStripe();
    expect((await handleCheckout(req(valid(), { origin: "https://evil.com" }), { stripe })).status).toBe(403);
    expect((await handleCheckout(req(valid(), { "content-type": "text/plain" }), { stripe })).status).toBe(415);
    expect((await handleCheckout(req("{kaputt"), { stripe })).status).toBe(400);
  });
  it("drosselt mit 429", async () => {
    process.env.CHECKOUT_RATE_MAX = "2";
    (globalThis as { __checkoutLimiter?: unknown }).__checkoutLimiter = undefined;
    const { stripe } = fakeStripe();
    const ok = () => handleCheckout(req(valid()), { stripe });
    expect((await ok()).status).toBe(200);
    expect((await ok()).status).toBe(200);
    expect((await ok()).status).toBe(429);
  });
  it("meldet Stripe-Fehler als 502 ohne Details", async () => {
    const stripe = { customers: { create: vi.fn().mockRejectedValue(new Error("boom: sk_test_secret")) }, checkout: { sessions: { create: vi.fn() } } } as unknown as Pick<Stripe, "checkout" | "customers">;
    const res = await handleCheckout(req(valid()), { stripe });
    expect(res.status).toBe(502);
    expect(JSON.stringify(res.body)).not.toContain("sk_test");
  });
});

describe("Stripe-Webhook", () => {
  const session = { id: "cs_1", payment_status: "paid", amount_total: 106981, metadata: { slug: "einzelcoaching", quantity: "1", net_cents: "89900", vat_cents: "17081" }, customer_details: { name: "Anna\nBcc: x@y.de", email: "a@b.de" } } as unknown as Stripe.Checkout.Session;
  const hook = (event: unknown, throws = false) => ({ webhooks: { constructEvent: vi.fn(() => { if (throws) throw new Error("bad sig"); return event; }) } }) as unknown as Pick<Stripe, "webhooks">;
  const wreq = (sig: string | null = "t=1,v1=abc") => new Request("https://a.de/api/stripe/webhook", { method: "POST", headers: sig ? { "stripe-signature": sig } : {}, body: "{}" });

  it("lehnt fehlende und ungültige Signatur ab", async () => {
    expect((await handleStripeWebhook(wreq(null), { stripe: hook({}) })).status).toBe(400);
    expect((await handleStripeWebhook(wreq(), { stripe: hook({}, true) })).status).toBe(400);
  });
  it("benachrichtigt bei bezahlter Sitzung genau einmal", async () => {
    const notify = vi.fn().mockResolvedValue(undefined);
    const res = await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session } }), notify });
    expect(res.status).toBe(200);
    expect(notify).toHaveBeenCalledTimes(1);
  });
  it("benachrichtigt nicht bei unbezahlter Sitzung oder anderen Ereignissen", async () => {
    const notify = vi.fn();
    const unpaid = { ...session, payment_status: "unpaid" } as Stripe.Checkout.Session;
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: unpaid } }), notify });
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "charge.refunded", data: { object: {} } }), notify });
    expect(notify).not.toHaveBeenCalled();
  });
  it("antwortet 500, wenn die Benachrichtigung scheitert (Stripe wiederholt)", async () => {
    const notify = vi.fn().mockRejectedValue(new Error("smtp down"));
    const res = await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session } }), notify });
    expect(res.status).toBe(500);
  });
  it("Buchungsmail: Betrag korrekt und kein Zeilenumbruch im Betreff", () => {
    const m = buildBookingMessage(session);
    expect(m.subject).not.toMatch(/[\r\n]/);
    expect(m.text).toContain("1.069,81");
  });
});
