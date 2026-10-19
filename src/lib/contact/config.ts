import { randomBytes } from "node:crypto";
import { RateLimiter } from "./rateLimit";

const int = (v: string | undefined, fallback: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

export function getConfig(env: NodeJS.ProcessEnv = process.env) {
  const smtpReady = Boolean(env.SMTP_HOST && env.CONTACT_TO && env.CONTACT_FROM);
  return {
    to: env.CONTACT_TO ?? "",
    from: env.CONTACT_FROM ?? "",
    smtp: {
      host: env.SMTP_HOST ?? "",
      port: int(env.SMTP_PORT, 587),
      secure: env.SMTP_SECURE === "true",
      user: env.SMTP_USER ?? "",
      pass: env.SMTP_PASS ?? "",
    },
    /** Es wird nur versendet, wenn SMTP vollständig konfiguriert UND ausdrücklich freigegeben ist. */
    mode: (smtpReady && env.MAIL_SEND_ENABLED === "true" ? "send" : "dry-run") as "send" | "dry-run",
    rateMax: int(env.RATE_LIMIT_MAX, 5),
    rateWindowMs: int(env.RATE_LIMIT_WINDOW_SECONDS, 900) * 1000,
    /** false | true (X-Forwarded-For) | "cloudflare" (CF-Connecting-IP – von Cloudflare gesetzt, nicht fälschbar) */
    trustProxy: (env.TRUST_PROXY === "cloudflare" ? "cloudflare" : env.TRUST_PROXY === "true") as boolean | "cloudflare",
  };
}

/** Ohne FORM_SECRET wird pro Prozessstart ein Zufallswert genutzt (Tokens überleben keinen Neustart). */
let ephemeralSecret: string | undefined;
export function getSecret(env: NodeJS.ProcessEnv = process.env): string {
  if (env.FORM_SECRET && env.FORM_SECRET.length >= 32) return env.FORM_SECRET;
  ephemeralSecret ??= randomBytes(32).toString("hex");
  return ephemeralSecret;
}

const g = globalThis as unknown as { __contactLimiter?: RateLimiter; __contactGlobal?: RateLimiter };

export function getLimiters() {
  const cfg = getConfig();
  g.__contactLimiter ??= new RateLimiter(cfg.rateMax, cfg.rateWindowMs);
  // Gesamtdeckel gegen verteilte Angriffe / nicht ermittelbare Client-IP
  g.__contactGlobal ??= new RateLimiter(cfg.rateMax * 20, cfg.rateWindowMs * 4);
  return { perClient: g.__contactLimiter, global: g.__contactGlobal };
}
