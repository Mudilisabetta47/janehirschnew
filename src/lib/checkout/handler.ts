import type Stripe from "stripe";
import { getService } from "@/content/services";
import { clientKey, isSameOrigin } from "@/lib/contact/handler";
import { getConfig as getContactConfig, getSecret } from "@/lib/contact/config";
import { verifyToken } from "@/lib/contact/token";
import { euro, quoteCart, VAT_RATE } from "./pricing";
import { checkoutSchema, flattenCheckoutErrors, type CheckoutFieldErrors } from "./schema";
import { getCheckoutConfig, getCheckoutLimiter, getStripe } from "./config";

export { checkoutSchema };

export type CheckoutBody =
  | { ok: true; url: string }
  | { ok: false; code: string; message: string; fieldErrors?: CheckoutFieldErrors };
export type CheckoutResponse = { status: number; body: CheckoutBody; headers?: Record<string, string> };

const fail = (status: number, code: string, message: string, extra?: { headers?: Record<string, string>; fieldErrors?: CheckoutFieldErrors }): CheckoutResponse => ({
  status,
  headers: extra?.headers,
  body: { ok: false, code, message, fieldErrors: extra?.fieldErrors },
});

type Deps = { stripe?: Pick<Stripe, "checkout" | "customers"> };

export async function handleCheckout(request: Request, deps: Deps = {}): Promise<CheckoutResponse> {
  const cfg = getCheckoutConfig();
  const headers = request.headers;

  if (!cfg.enabled && !deps.stripe)
    return fail(503, "not-configured", "Die Online-Zahlung ist noch nicht freigeschaltet. Bitte nutze die Anfrage – ich melde mich persönlich.");
  if (!isSameOrigin(headers)) return fail(403, "forbidden", "Anfrage nicht erlaubt.");
  if (!(headers.get("content-type") ?? "").toLowerCase().startsWith("application/json"))
    return fail(415, "unsupported", "Ungültiges Anfrageformat.");

  const limit = getCheckoutLimiter().check(clientKey(headers, getContactConfig().trustProxy));
  if (!limit.allowed)
    return fail(429, "rate-limited", "Zu viele Versuche. Bitte warte kurz und versuche es erneut.", { headers: { "Retry-After": String(limit.retryAfterSeconds) } });

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 8 * 1024) return fail(413, "too-large", "Anfrage zu groß.");
    raw = JSON.parse(text);
  } catch {
    return fail(400, "bad-json", "Die Anfrage konnte nicht gelesen werden.");
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return fail(400, "bad-json", "Die Anfrage konnte nicht gelesen werden.");

  // Honeypot: Bots bekommen eine Scheinantwort, es passiert nichts.
  const hp = (raw as Record<string, unknown>).website;
  if (typeof hp === "string" && hp.length > 0) return fail(400, "rejected", "Anfrage abgelehnt.");

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) return fail(422, "validation", "Bitte prüfe die markierten Felder.", { fieldErrors: flattenCheckoutErrors(parsed.error) });
  const d = parsed.data;

  const tokenState = verifyToken(d.token, getSecret());
  if (tokenState === "too-fast") return fail(400, "too-fast", "Das ging sehr schnell – bitte versuche es in ein paar Sekunden noch einmal.");
  if (tokenState !== "ok") return fail(400, "token", "Die Sicherheitsprüfung ist abgelaufen. Bitte lade die Seite neu.");

  const q = quoteCart(d.items, getService);
  if (!q) return fail(422, "validation", "Der Warenkorb enthält ungültige Positionen oder zu große Mengen.", { fieldErrors: { items: "Bitte prüfe deinen Warenkorb." } });
  const stripe = deps.stripe ?? getStripe();
  const fullName = `${d.firstName} ${d.lastName}`;
  const itemsMeta = q.lines.map((l) => `${l.slug}:${l.quantity}`).join(",");
  const vatId = d.vatId.toUpperCase();

  try {
    // Kunde mit Name + Anschrift anlegen, damit die Stripe-Seite nur noch die Zahlung abfragt und die Rechnung stimmt.
    const customer = await stripe.customers.create({
      name: d.company || fullName,
      ...(d.company ? { business_name: d.company, individual_name: fullName } : { individual_name: fullName }),
      email: d.email,
      ...(d.phone ? { phone: d.phone } : {}),
      address: { line1: d.street, postal_code: d.zip, city: d.city, country: "DE" },
      preferred_locales: ["de"],
      metadata: { first_name: d.firstName, last_name: d.lastName, ...(d.company ? { company: d.company } : {}), ...(vatId ? { vat_id: vatId } : {}) },
    });

    const invoiceFields = [
      ...(d.company ? [{ name: "Ansprechpartner:in", value: fullName.slice(0, 30) }] : []),
      ...(vatId ? [{ name: "USt-IdNr. Kunde", value: vatId }] : []),
    ];

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      customer: customer.id,
      line_items: q.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: "eur" as const,
          unit_amount: l.unitGrossCents,
          product_data: {
            name: `${l.title} – Jane Hirsch`,
            description: `${euro(l.unitNetCents)} netto + ${Math.round(VAT_RATE * 100)} % MwSt. je ${l.unit}`,
          },
        },
      })),
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: q.lines.map((l) => `${l.title}, ${l.quantity} × ${l.unit}`).join("; ").slice(0, 400),
          metadata: { items: itemsMeta },
          ...(invoiceFields.length ? { custom_fields: invoiceFields } : {}),
        },
      },
      custom_text: {
        submit: { message: `Mit der Zahlung akzeptierst du die [AGB](${cfg.siteUrl}/agb). Preise: ${euro(q.netCents)} netto + ${euro(q.vatCents)} MwSt.` },
      },
      metadata: {
        items: itemsMeta,
        net_cents: String(q.netCents),
        vat_cents: String(q.vatCents),
        name: fullName,
        ...(d.company ? { company: d.company } : {}),
        ...(vatId ? { vat_id: vatId } : {}),
        ...(d.wish ? { wish: d.wish } : {}),
      },
      success_url: `${cfg.siteUrl}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cfg.siteUrl}/kasse?zahlung=abgebrochen`,
    });
    if (!session.url) return fail(502, "no-url", "Die Zahlungsseite konnte nicht geöffnet werden. Bitte nutze die Anfrage.");
    return { status: 200, body: { ok: true, url: session.url } };
  } catch (error) {
    console.error("[checkout] Stripe-Fehler:", error instanceof Error ? error.name : "unknown");
    return fail(502, "stripe-failed", "Die Zahlungsseite ist gerade nicht erreichbar. Bitte versuche es später erneut oder nutze die Anfrage.");
  }
}
