import type Stripe from "stripe";
import { getCheckoutConfig, getStripe } from "./config";
import { sendBookingMail } from "./booking-mail";

type Deps = { stripe?: Pick<Stripe, "webhooks">; notify?: (s: Stripe.Checkout.Session) => Promise<unknown> };

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

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        await (deps.notify ?? sendBookingMail)(session);
      } catch {
        // 500 → Stripe wiederholt die Zustellung automatisch
        console.error("[stripe-webhook] Benachrichtigung fehlgeschlagen");
        return { status: 500, body: "notify failed" };
      }
    }
  }
  return { status: 200, body: "ok" };
}
