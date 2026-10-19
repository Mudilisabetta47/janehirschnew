import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { all, resetDb, run } from "@/lib/db/db";
import {
  addActivity, deleteInquiry, getInquiry, getOrder, insertInquiry, listActivity, listInquiries, listOrders, parseOrderItems,
  purgeInquiries, setOrderPaymentByIntent, stats, updateInquiry, updateOrder, upsertOrderFromSession,
} from "@/lib/db/repo";
import { handleStripeWebhook } from "@/lib/checkout/webhook";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { createSessionToken, verifySessionToken } from "@/lib/admin/session";
import { csvCell, toCsv } from "@/lib/admin/format";
import { readiness } from "@/lib/admin/readiness";

beforeEach(() => {
  process.env.DATA_DIR = ":memory:";
  delete process.env.STORE_ENABLED;
  resetDb();
});

const inq = { name: "Anna Beispiel", email: "anna@example.com", phone: "", salon: "", topic: "einzelcoaching", message: "Ich hätte gern ein Einzelcoaching." };

const session = (over: Partial<Stripe.Checkout.Session> = {}) =>
  ({
    id: "cs_test_1", payment_status: "paid", livemode: false, amount_total: 106981, payment_intent: "pi_1",
    metadata: { items: "einzelcoaching:1", net_cents: "89900", vat_cents: "17081", name: "Anna Beispiel", company: "Salon Test", vat_id: "DE123456789", wish: "Frühjahr" },
    customer_details: { name: "Anna Beispiel", email: "anna@example.com", phone: "0173", address: { line1: "Musterweg 1", postal_code: "28844", city: "Weyhe", country: "DE" } },
    ...over,
  }) as unknown as Stripe.Checkout.Session;

describe("Datenbank & Anfragen", () => {
  it("legt das Schema an und speichert Anfragen mit Verlauf", async () => {
    const id = (await insertInquiry(inq));
    const row = (await getInquiry(id))!;
    expect(row).toMatchObject({ ...inq, status: "neu" });
    expect((await listActivity("inquiry", id))[0]!.text).toMatch(/eingegangen/);
    expect((await all<{ name: string }>("SELECT name FROM sqlite_master WHERE type = 'table'")).map((t) => t.name)).toEqual(expect.arrayContaining(["inquiries", "orders", "activity"]));
  });
  it("ändert Status/Notiz, protokolliert und setzt beantwortet_am", async () => {
    const id = (await insertInquiry(inq));
    expect((await updateInquiry(id, { status: "beantwortet", notes: "Termin vorgeschlagen" }))).toBe(true);
    const row = (await getInquiry(id))!;
    expect(row).toMatchObject({ status: "beantwortet", notes: "Termin vorgeschlagen" });
    expect(row.answered_at).toBeTruthy();
    expect((await listActivity("inquiry", id)).map((a) => a.text).join("|")).toMatch(/Status: Neu → Beantwortet/);
  });
  it("lehnt unbekannte Status-Werte ab (Status bleibt)", async () => {
    const id = (await insertInquiry(inq));
    (await updateInquiry(id, { status: "hack'; DROP TABLE inquiries;--" }));
    expect((await getInquiry(id))!.status).toBe("neu");
  });
  it("sucht und filtert; SQL-Sonderzeichen in der Suche sind unschädlich", async () => {
    (await insertInquiry(inq));
    (await insertInquiry({ ...inq, name: "Berta", message: "Frage zum Saloncoaching", topic: "saloncoaching" }));
    expect((await listInquiries({ q: "Salon" }))).toHaveLength(1);
    expect((await listInquiries({ q: "'; DROP TABLE inquiries; --" }))).toHaveLength(0);
    expect((await listInquiries({ status: "neu" }))).toHaveLength(2);
    expect((await listInquiries({ status: "erledigt" }))).toHaveLength(0);
  });
  it("löscht Anfragen samt Verlauf", async () => {
    const id = (await insertInquiry(inq));
    expect((await deleteInquiry(id))).toBe(true);
    expect((await getInquiry(id))).toBeUndefined();
    expect((await listActivity("inquiry", id))).toHaveLength(0);
  });
  it("löscht erledigte Anfragen nach Aufbewahrungsfrist, offene nie", async () => {
    const old = (await insertInquiry(inq));
    const open = (await insertInquiry({ ...inq, name: "Offen" }));
    const recent = (await insertInquiry({ ...inq, name: "Neu erledigt" }));
    (await updateInquiry(old, { status: "erledigt" }));
    (await updateInquiry(recent, { status: "erledigt" }));
    const past = new Date(Date.now() - 400 * 86_400_000).toISOString();
    await run("UPDATE inquiries SET updated_at = ? WHERE id IN (?, ?)", [past, old, open]);
    expect((await purgeInquiries(180))).toBe(1);
    expect((await getInquiry(old))).toBeUndefined();
    expect((await getInquiry(open))).toBeDefined();
    expect((await getInquiry(recent))).toBeDefined();
  });
});

describe("Bestellungen", () => {
  it("speichert eine bezahlte Sitzung vollständig und idempotent", async () => {
    const a = (await upsertOrderFromSession(session()));
    const b = (await upsertOrderFromSession(session()));
    expect(a).toMatchObject({ created: true, becamePaid: true });
    expect(b).toMatchObject({ id: a.id, created: false, becamePaid: false });
    expect((await listOrders())).toHaveLength(1);
    const o = (await getOrder(a.id))!;
    expect(o).toMatchObject({ name: "Anna Beispiel", company: "Salon Test", email: "anna@example.com", zip: "28844", vat_id: "DE123456789", wish: "Frühjahr", gross_cents: 106981, payment_status: "paid", livemode: 0 });
    expect(parseOrderItems(o)).toEqual([{ slug: "einzelcoaching", title: "Einzelcoaching", quantity: 1, netCents: 89900 }]);
  });
  it("legt unbezahlte Sitzungen als offen an und meldet später „bezahlt“ genau einmal", async () => {
    const first = (await upsertOrderFromSession(session({ payment_status: "unpaid" })));
    expect(first.becamePaid).toBe(false);
    expect((await getOrder(first.id))!.payment_status).toBe("pending");
    const later = (await upsertOrderFromSession(session({ payment_status: "paid" })));
    expect(later).toMatchObject({ id: first.id, becamePaid: true });
    expect((await upsertOrderFromSession(session())).becamePaid).toBe(false);
  });
  it("erfasst Erstattungen über die Payment-Intent-ID und überschreibt sie nicht mehr", async () => {
    const { id } = (await upsertOrderFromSession(session()));
    expect((await setOrderPaymentByIntent("pi_1", "refunded"))).toBe(id);
    expect((await getOrder(id))!.payment_status).toBe("refunded");
    (await upsertOrderFromSession(session()));
    expect((await getOrder(id))!.payment_status).toBe("refunded");
    expect((await setOrderPaymentByIntent("pi_unbekannt", "refunded"))).toBeNull();
  });
  it("Status/Notiz ändern, Kennzahlen zählen nur bezahlte, nicht stornierte Bestellungen", async () => {
    const { id } = (await upsertOrderFromSession(session()));
    (await upsertOrderFromSession(session({ id: "cs_test_2", payment_intent: "pi_2", metadata: { ...session().metadata, net_cents: "44900" } })));
    (await updateOrder(id, { status: "termin_abgestimmt", notes: "12.05." }));
    expect((await getOrder(id))).toMatchObject({ status: "termin_abgestimmt", notes: "12.05." });
    expect((await stats()).revenueTotalNet).toBe(89900 + 44900);
    (await updateOrder(id, { status: "storniert" }));
    expect((await stats()).revenueTotalNet).toBe(44900);
    (await addActivity("order", id, "x"));
    expect((await listActivity("order", id)).length).toBeGreaterThan(2);
  });
});

describe("Webhook speichert zuerst, dann Mail", () => {
  const hook = (event: unknown) => ({ webhooks: { constructEvent: vi.fn(() => event) } }) as unknown as Pick<Stripe, "webhooks">;
  const wreq = () => new Request("https://a.de/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": "t=1,v1=abc" }, body: "{}" });

  it("speichert die Bestellung, benachrichtigt einmal und merkt sich den Mailstatus", async () => {
    const notify = vi.fn().mockResolvedValue("dry-run");
    const ev = { type: "checkout.session.completed", data: { object: session() } };
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200);
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200); // Stripe-Wiederholung
    expect(notify).toHaveBeenCalledTimes(1);
    const o = (await listOrders())[0]!;
    expect(o.mail_state).toBe("nicht_konfiguriert");
  });
  it("Mail scheitert → Bestellung bleibt gespeichert, Antwort 200 (kein doppeltes Speichern bei Wiederholung)", async () => {
    const notify = vi.fn().mockRejectedValue(new Error("smtp down"));
    const ev = { type: "checkout.session.completed", data: { object: session() } };
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200);
    expect((await listOrders())).toHaveLength(1);
    expect((await listOrders())[0]!.mail_state).toBe("fehlgeschlagen");
  });
  it("verarbeitet fehlgeschlagene Zahlung und Erstattung", async () => {
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session({ payment_status: "unpaid" }) } }), notify: vi.fn() });
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.async_payment_failed", data: { object: session() } }), notify: vi.fn() });
    expect((await listOrders())[0]!.payment_status).toBe("failed");
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.async_payment_succeeded", data: { object: session() } }), notify: vi.fn() });
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "charge.refunded", data: { object: { payment_intent: "pi_1" } } }), notify: vi.fn() });
    expect((await listOrders())[0]!.payment_status).toBe("refunded");
  });
  it("ohne Speicher: Mailfehler → 500 (Stripe wiederholt)", async () => {
    process.env.STORE_ENABLED = "false";
    const notify = vi.fn().mockRejectedValue(new Error("smtp down"));
    const res = await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session() } }), notify });
    expect(res.status).toBe(500);
  });
});

describe("Backend-Zugang", () => {
  it("hasht Passwörter mit Salt und prüft sie", async () => {
    const h = hashPassword("ein-langes-passwort");
    expect(h).toMatch(/^scrypt:\d+:8:1:[0-9a-f]+:[0-9a-f]+$/);
    expect(h).not.toContain("$");
    expect(verifyPassword("ein-langes-passwort", h)).toBe(true);
    expect(verifyPassword("falsch", h)).toBe(false);
    expect(hashPassword("ein-langes-passwort")).not.toBe(h);
  });
  it("lehnt kaputte oder manipulierte Hashes ab", async () => {
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "scrypt:16384:8:1:zz:zz")).toBe(false);
    expect(verifyPassword("x", "md5:1:2:3:4:5")).toBe(false);
  });
  it("signiert Sitzungen, erkennt Ablauf und Manipulation", async () => {
    const secret = "s".repeat(40);
    const t = createSessionToken(secret, 1_700_000_000_000, 60);
    expect(verifySessionToken(t, secret, 1_700_000_030_000)).toBe(true);
    expect(verifySessionToken(t, secret, 1_700_000_061_000)).toBe(false);
    expect(verifySessionToken(t, "x".repeat(40), 1_700_000_030_000)).toBe(false);
    expect(verifySessionToken(t.replace(/.$/, "0"), secret, 1_700_000_030_000)).toBe(false);
    expect(verifySessionToken(undefined, secret)).toBe(false);
    expect(verifySessionToken("müll", secret)).toBe(false);
  });
});

describe("CSV & Bereitschaft", () => {
  it("entschärft Formeln, verdoppelt Anführungszeichen und nutzt Semikolon + BOM", async () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe(`"'=HYPERLINK(""x"")"`);
    expect(csvCell("+49 173")).toBe(`"'+49 173"`);
    expect(csvCell('sagt "hallo"')).toBe('"sagt ""hallo"""');
    const csv = toCsv([["a", "b"], [1, "c;d"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"1";"c;d"');
  });
  it("Bereitschafts-Check meldet fehlende Einrichtung ehrlich", async () => {
    const empty = readiness({} as NodeJS.ProcessEnv);
    const by = Object.fromEntries(empty.map((c) => [c.label, c.ok]));
    expect(by["E-Mail-Benachrichtigung aktiv"]).toBe(false);
    expect(by["Backend-Passwort gesetzt"]).toBe(false);
    expect(by["Online-Zahlung (Stripe) aktiv"]).toBe(false);
    const ready = readiness({ SMTP_HOST: "smtp.ionos.de", CONTACT_TO: "a@b.de", CONTACT_FROM: "x@y.de", MAIL_SEND_ENABLED: "true", ADMIN_PASSWORD_HASH: "h", STRIPE_SECRET_KEY: "sk_test_1", STRIPE_WEBHOOK_SECRET: "whsec", FORM_SECRET: "f".repeat(40) } as unknown as NodeJS.ProcessEnv);
    const ok = Object.fromEntries(ready.map((c) => [c.label, c.ok]));
    expect(ok["E-Mail-Benachrichtigung aktiv"]).toBe(true);
    expect(ok["Backend-Passwort gesetzt"]).toBe(true);
    expect(ok["Online-Zahlung (Stripe) aktiv"]).toBe(true);
  });
});
