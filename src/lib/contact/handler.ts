import { contactSchema, flattenErrors, type FieldErrors } from "./schema";
import { getConfig, getLimiters, getSecret } from "./config";
import { verifyToken } from "./token";
import { sendContactMail } from "./mail";
import { storeEnabled } from "@/lib/db/db";
import { insertInquiry, setInquiryMailState } from "@/lib/db/repo";

const MAX_BODY_BYTES = 16 * 1024;

export type ApiBody =
  | { ok: true; mode: "send" | "dry-run"; stored: boolean }
  | { ok: false; code: string; message: string; fieldErrors?: FieldErrors };

export type ApiResponse = { status: number; body: ApiBody; headers?: Record<string, string> };

const fail = (status: number, code: string, message: string, extra?: Partial<ApiResponse & { fieldErrors: FieldErrors }>): ApiResponse => ({
  status,
  headers: extra?.headers,
  body: { ok: false, code, message, fieldErrors: extra?.fieldErrors },
});

/**
 * Ermittelt einen Schlüssel für das Rate-Limit.
 * - `"cloudflare"`: nur `CF-Connecting-IP` (setzt Cloudflare selbst; Client-Angaben werden überschrieben).
 *   Voraussetzung: Der Server ist nur über Cloudflare erreichbar.
 * - `true`: `X-Forwarded-For` (erster Eintrag) bzw. `X-Real-IP` – nur hinter einem Proxy, der diese Header überschreibt.
 * - sonst: grobe Gruppierung nach Browser-Merkmalen (zusammen mit dem Gesamtdeckel).
 */
export function clientKey(headers: Headers, trustProxy: boolean | "cloudflare"): string {
  if (trustProxy === "cloudflare") {
    const ip = headers.get("cf-connecting-ip")?.trim();
    if (ip) return `ip:${ip.slice(0, 64)}`;
  } else if (trustProxy) {
    const xff = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ip = xff || headers.get("x-real-ip")?.trim();
    if (ip) return `ip:${ip.slice(0, 64)}`;
  }
  // Ohne vertrauenswürdige IP: grobe Gruppierung (greift zusammen mit dem Gesamtdeckel)
  return `ua:${(headers.get("user-agent") ?? "").slice(0, 80)}|${(headers.get("accept-language") ?? "").slice(0, 30)}`;
}

/** Nur Anfragen von der eigenen Seite zulassen. */
export function isSameOrigin(headers: Headers): boolean {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  // Kein Origin-Header: nur zulassen, wenn der Browser "same-origin" meldet
  return headers.get("sec-fetch-site") === "same-origin";
}

export async function handleContact(request: Request): Promise<ApiResponse> {
  const headers = request.headers;
  const cfg = getConfig();

  if (!isSameOrigin(headers)) return fail(403, "forbidden", "Anfrage nicht erlaubt.");
  if (!(headers.get("content-type") ?? "").toLowerCase().startsWith("application/json"))
    return fail(415, "unsupported", "Ungültiges Anfrageformat.");

  const declared = Number(headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return fail(413, "too-large", "Die Nachricht ist zu groß.");

  const { perClient, global } = getLimiters();
  const key = clientKey(headers, cfg.trustProxy);
  const limit = perClient.check(key);
  const globalLimit = global.check("all");
  if (!limit.allowed || !globalLimit.allowed) {
    const wait = Math.max(limit.retryAfterSeconds, globalLimit.retryAfterSeconds);
    return fail(429, "rate-limited", `Zu viele Anfragen. Bitte versuche es in ${Math.ceil(wait / 60)} Min. erneut oder ruf mich direkt an.`, {
      headers: { "Retry-After": String(wait) },
    });
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return fail(413, "too-large", "Die Nachricht ist zu groß.");
    raw = JSON.parse(text);
  } catch {
    return fail(400, "bad-json", "Die Anfrage konnte nicht gelesen werden.");
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return fail(400, "bad-json", "Die Anfrage konnte nicht gelesen werden.");

  // Honeypot: Bots bekommen scheinbar Erfolg, es passiert nichts.
  const hp = (raw as Record<string, unknown>).website;
  if (typeof hp === "string" && hp.length > 0) return { status: 200, body: { ok: true, mode: cfg.mode, stored: false } };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return fail(422, "validation", "Bitte prüfe die markierten Felder.", { fieldErrors: flattenErrors(parsed.error) });
  }

  const tokenState = verifyToken(parsed.data.token, getSecret());
  if (tokenState === "too-fast") return fail(400, "too-fast", "Das ging sehr schnell – bitte versuche es in ein paar Sekunden noch einmal.");
  if (tokenState !== "ok") return fail(400, "token", "Die Sicherheitsprüfung ist abgelaufen. Bitte lade die Seite neu und sende erneut.");

  // 1) Erst dauerhaft speichern – so geht keine Anfrage verloren, auch wenn der Mailversand scheitert.
  let inquiryId: number | null = null;
  if (storeEnabled()) {
    try {
      const d = parsed.data;
      inquiryId = await insertInquiry({ name: d.name, email: d.email, phone: d.phone, salon: d.salon, topic: d.topic, message: d.message });
    } catch (error) {
      console.error("[contact] Speichern fehlgeschlagen:", error instanceof Error ? error.name : "unknown");
    }
  }

  // 2) Dann Benachrichtigung per Mail
  try {
    const result = await sendContactMail(parsed.data);
    if (inquiryId !== null) await setInquiryMailState(inquiryId, result.mode === "send" ? "gesendet" : "nicht_konfiguriert");
    return { status: 200, body: { ok: true, mode: result.mode, stored: inquiryId !== null } };
  } catch (error) {
    // Keine Nutzerdaten ins Log – nur Fehlerklasse.
    console.error("[contact] Versand fehlgeschlagen:", error instanceof Error ? error.name : "unknown");
    if (inquiryId !== null) {
      await setInquiryMailState(inquiryId, "fehlgeschlagen");
      return { status: 200, body: { ok: true, mode: "send", stored: true } }; // gespeichert → Jane sieht sie im Backend
    }
    return fail(502, "mail-failed", "Die Nachricht konnte gerade nicht zugestellt werden. Bitte versuche es später erneut oder ruf mich direkt an.");
  }
}
