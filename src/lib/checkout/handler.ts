import { z } from "zod";
import type Stripe from "stripe";
import { services, getService } from "@/content/services";
import { clientKey, isSameOrigin } from "@/lib/contact/handler";
import { getConfig as getContactConfig } from "@/lib/contact/config";
import { euro, quote, VAT_RATE } from "./pricing";
import { getCheckoutConfig, getCheckoutLimiter, getStripe } from "./config";

const bookable = services.filter((s) => s.booking).map((s) => s.slug) as [string, ...string[]];

export const checkoutSchema = z.object({
  slug: z.enum(bookable, { error: "Dieses Angebot ist nicht online buchbar." }),
  quantity: z.number({ error: "Bitte gib eine Anzahl an." }).int().min(1).max(20),
  accepted: z.literal(true, { error: "Bitte bestätige die AGB." }),
});

export type CheckoutBody = { ok: true; url: string } | { ok: false; code: string; message: string };
export type CheckoutResponse = { status: number; body: CheckoutBody; headers?: Record<string, string> };

const fail = (status: number, code: string, message: string, headers?: Record<string, string>): CheckoutResponse => ({
  status,
  headers,
  body: { ok: false, code, message },
});

type Deps = { stripe?: Pick<Stripe, "checkout"> };

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
    return fail(429, "rate-limited", "Zu viele Versuche. Bitte warte kurz und versuche es erneut.", { "Retry-After": String(limit.retryAfterSeconds) });

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > 2048) return fail(413, "too-large", "Anfrage zu groß.");
    raw = JSON.parse(text);
  } catch {
    return fail(400, "bad-json", "Die Anfrage konnte nicht gelesen werden.");
  }

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) return fail(422, "validation", parsed.error.issues[0]?.message ?? "Ungültige Eingabe.");

  const service = getService(parsed.data.slug);
  if (!service?.booking) return fail(422, "validation", "Dieses Angebot ist nicht online buchbar.");
  if (parsed.data.quantity > service.booking.maxQuantity)
    return fail(422, "validation", `Online sind höchstens ${service.booking.maxQuantity} buchbar.`);

  const q = quote(service.booking, parsed.data.quantity);
  const stripe = deps.stripe ?? getStripe();

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "de",
      line_items: [
        {
          quantity: q.quantity,
          price_data: {
            currency: "eur",
            unit_amount: q.unitGrossCents,
            product_data: {
              name: `${service.title} – Jane Hirsch`,
              description: `${euro(service.booking.netCents)} netto + ${Math.round(VAT_RATE * 100)} % MwSt. je ${service.booking.unit}`,
            },
          },
        },
      ],
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      tax_id_collection: { enabled: true },
      customer_creation: "always",
      invoice_creation: {
        enabled: true,
        invoice_data: { description: `${service.title}, ${q.quantity} × ${service.booking.unit}`, metadata: { slug: service.slug } },
      },
      custom_fields: [{ key: "wunschzeitraum", label: { type: "custom", custom: "Wunschzeitraum / Anmerkung" }, type: "text", optional: true }],
      custom_text: {
        submit: { message: `Mit der Zahlung akzeptierst du die [AGB](${cfg.siteUrl}/agb). Preise: ${euro(q.netCents)} netto + ${euro(q.vatCents)} MwSt.` },
      },
      metadata: { slug: service.slug, quantity: String(q.quantity), net_cents: String(q.netCents), vat_cents: String(q.vatCents) },
      success_url: `${cfg.siteUrl}/buchung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${cfg.siteUrl}/coaching/${service.slug}?zahlung=abgebrochen#buchen`,
    });
    if (!session.url) return fail(502, "no-url", "Die Zahlungsseite konnte nicht geöffnet werden. Bitte nutze die Anfrage.");
    return { status: 200, body: { ok: true, url: session.url } };
  } catch (error) {
    console.error("[checkout] Stripe-Fehler:", error instanceof Error ? error.name : "unknown");
    return fail(502, "stripe-failed", "Die Zahlungsseite ist gerade nicht erreichbar. Bitte versuche es später erneut oder nutze die Anfrage.");
  }
}
