import { getConfig } from "@/lib/contact/config";
import { getCheckoutConfig } from "@/lib/checkout/config";
import { adminConfigured } from "./auth";
import { dbConfig, dbLabel, storeEnabled } from "@/lib/db/db";
import { site } from "@/content/site";

export type Check = { label: string; ok: boolean; detail: string };

/** „Ist die Website bereit?“ – ehrlicher Selbsttest der Konfiguration (ohne Geheimnisse anzuzeigen). */
export function readiness(env: NodeJS.ProcessEnv = process.env): Check[] {
  const mail = getConfig(env);
  const co = getCheckoutConfig(env);
  const key = co.secretKey;
  return [
    { label: "Formular-Anfragen werden gespeichert", ok: storeEnabled(), detail: storeEnabled() ? `Datenbank: ${dbLabel(env)}` : "STORE_ENABLED=false – Anfragen gehen nur per Mail ein" },
    { label: "Datenbank dauerhaft (nicht nur lokale Datei auf Serverless)", ok: !dbConfig(env).local || env.VERCEL !== "1", detail: "Auf Vercel/Serverless DATABASE_URL (Turso) setzen – lokale Dateien gehen dort verloren" },
    { label: "E-Mail-Benachrichtigung aktiv", ok: mail.mode === "send", detail: mail.mode === "send" ? `an ${mail.to}` : "SMTP_HOST/CONTACT_FROM fehlen oder MAIL_SEND_ENABLED ist nicht „true“ (Trockenlauf)" },
    { label: "Spam-Schutz-Geheimnis gesetzt (FORM_SECRET)", ok: (env.FORM_SECRET ?? "").length >= 32, detail: "mindestens 32 Zeichen" },
    { label: "Backend-Passwort gesetzt", ok: adminConfigured(env), detail: "ADMIN_PASSWORD_HASH" },
    { label: "Online-Zahlung (Stripe) aktiv", ok: co.enabled, detail: co.enabled ? (key.startsWith("sk_live_") ? "Live-Modus" : key.startsWith("sk_test_") ? "Testmodus" : "Schlüssel gesetzt") : "STRIPE_SECRET_KEY fehlt" },
    { label: "Stripe-Webhook-Secret gesetzt", ok: Boolean(co.webhookSecret), detail: "STRIPE_WEBHOOK_SECRET (Endpunkt /api/stripe/webhook)" },
    { label: "Kaufbereich auf Angebotsseiten sichtbar", ok: env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true", detail: "NEXT_PUBLIC_CHECKOUT_ENABLED (Build-Variable)" },
    { label: "Öffentliche Adresse nicht localhost", ok: !/localhost|127\.0\.0\.1/.test(site.url), detail: site.url },
    { label: "Suchmaschinen-Sperre aus (Livebetrieb)", ok: env.SITE_NOINDEX !== "true", detail: env.SITE_NOINDEX === "true" ? "SITE_NOINDEX=true – Staging" : "Seite ist indexierbar" },
    { label: "Proxy-Header vertrauenswürdig (TRUST_PROXY)", ok: env.TRUST_PROXY === "true" || env.TRUST_PROXY === "cloudflare", detail: "hinter Cloudflare: cloudflare, sonst hinter Reverse-Proxy: true; ohne Proxy leer lassen (Rate-Limit greift dann grob)" },
  ];
}
