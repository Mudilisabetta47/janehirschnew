import Stripe from "stripe";
import { RateLimiter } from "@/lib/contact/rateLimit";

export function getCheckoutConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    secretKey: env.STRIPE_SECRET_KEY ?? "",
    webhookSecret: env.STRIPE_WEBHOOK_SECRET ?? "",
    /** Checkout ist nur aktiv, wenn der Schlüssel gesetzt ist. */
    enabled: Boolean(env.STRIPE_SECRET_KEY),
    siteUrl: (env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
    rateMax: Number.parseInt(env.CHECKOUT_RATE_MAX ?? "", 10) || 10,
    rateWindowMs: (Number.parseInt(env.CHECKOUT_RATE_WINDOW_SECONDS ?? "", 10) || 900) * 1000,
  };
}

let client: Stripe | undefined;
export function getStripe(): Stripe {
  const { secretKey } = getCheckoutConfig();
  client ??= new Stripe(secretKey, { maxNetworkRetries: 1, timeout: 15_000 });
  return client;
}

const g = globalThis as unknown as { __checkoutLimiter?: RateLimiter };
export function getCheckoutLimiter() {
  const cfg = getCheckoutConfig();
  g.__checkoutLimiter ??= new RateLimiter(cfg.rateMax, cfg.rateWindowMs);
  return g.__checkoutLimiter;
}
