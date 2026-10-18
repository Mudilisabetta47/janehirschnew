import type Stripe from "stripe";
import { getCheckoutConfig, getStripe } from "./config";
import { sendBookingMail } from "./booking-mail";
import { storeEnabled } from "@/lib/db/db";
import { setOrderMailState, setOrderPaymentByIntent, setOrderPaymentBySession, upsertOrderFromSession } from "@/lib/db/repo";

type Deps = { stripe?: Pick<Stripe, "webhooks">; notify?: (s: Stripe.Checkout.Session) => Promise<"send" | "dry-run" | unknown> };

/** Verarbeitet Stripe-Webhooks: Signatur prüfen, bei bezahlter Sitzung Jane benachrichtigen. */
export async function handleStripeWebhook(request: Request, deps: Deps = {}): Promise<{ status: number; body: string }> {
  const cfg = getCheckoutConfig();
  if (!cfg.webhookSecret && !deps.stripe) return { status: 503, body: "webhook not configured" };

  const signature = request.headers.get("stripe-signature");
  if (!signature) return { status: 400, body: "missing signature" };

  const payload = await request.text();
  const stripe = deps.stripe ?? getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, cfg.webhookSecret);
  } catch {
    return { status: 400, body: "invalid signature" };
  }

  const store = storeEnabled();

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    let orderId: number | null = null;
    let shouldNotify = session.payment_status === "paid";
    if (store) {
      try {
        // Zuerst dauerhaft speichern (idempotent über die Sitzungs-ID) – Stripe wiederholt bei Fehlern.
        const r = upsertOrderFromSession(session);
        orderId = r.id;
        shouldNotify = r.becamePaid;
      } catch {
        console.error("[stripe-webhook] Speichern fehlgeschlagen");
        return { status: 500, body: "store failed" };
      }
    }
    if (shouldNotify) {
      try {
        const state = await (deps.notify ?? sendBookingMail)(session);
        if (orderId !== null) setOrderMailState(orderId, state === "send" ? "gesendet" : "nicht_konfiguriert");
      } catch {
        // Bestellung ist gespeichert; die Mail ist nur Zusatz. Ohne Speicher: 500 → Stripe wiederholt.
        console.error("[stripe-webhook] Benachrichtigung fehlgeschlagen");
        if (orderId !== null) setOrderMailState(orderId, "fehlgeschlagen");
        else return { status: 500, body: "notify failed" };
      }
    }
  } else if (event.type === "checkout.session.async_payment_failed" && store) {
    setOrderPaymentBySession((event.data.object as Stripe.Checkout.Session).id, "failed");
  } else if (event.type === "charge.refunded" && store) {
    const pi = (event.data.object as Stripe.Charge).payment_intent;
    setOrderPaymentByIntent(typeof pi === "string" ? pi : (pi?.id ?? ""), "refunded");
  }
  return { status: 200, body: "ok" };
}
