import { createHmac, timingSafeEqual } from "node:crypto";

/** Signierte Sitzung: `<ablaufMs>.<hmac>` – ohne Datenbank, ohne Nutzerdaten im Cookie. */
export const SESSION_COOKIE = "jh_admin";
export const SESSION_MAX_AGE_S = 8 * 60 * 60;

const sign = (secret: string, exp: string) => createHmac("sha256", secret).update(`admin:${exp}`).digest("hex");

export function createSessionToken(secret: string, now = Date.now(), maxAgeS = SESSION_MAX_AGE_S): string {
  const exp = String(now + maxAgeS * 1000);
  return `${exp}.${sign(secret, exp)}`;
}

export function verifySessionToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token) return false;
  const [exp, mac] = token.split(".");
  if (!exp || !mac || !/^\d{10,16}$/.test(exp) || !/^[0-9a-f]{64}$/.test(mac)) return false;
  const a = Buffer.from(sign(secret, exp), "hex");
  const b = Buffer.from(mac, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  return Number(exp) > now;
}
