import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Zeit-Token gegen simple Bots: Der Server signiert den Ausgabezeitpunkt.
 * Beim Absenden muss das Token echt sein und zwischen minAge und maxAge alt.
 * Format: `<timestampMs>.<hmacHex>` (kein Cookie nötig).
 */
const sign = (secret: string, ts: string) => createHmac("sha256", secret).update(`contact:${ts}`).digest("hex");

export function createToken(secret: string, now = Date.now()): string {
  const ts = String(now);
  return `${ts}.${sign(secret, ts)}`;
}

export type TokenCheck = "ok" | "invalid" | "too-fast" | "expired";

export function verifyToken(
  token: string,
  secret: string,
  { now = Date.now(), minAgeMs = 3_000, maxAgeMs = 2 * 60 * 60 * 1000 } = {},
): TokenCheck {
  const [ts, mac] = token.split(".");
  if (!ts || !mac || !/^\d{10,16}$/.test(ts) || !/^[0-9a-f]{64}$/.test(mac)) return "invalid";
  const expected = Buffer.from(sign(secret, ts), "hex");
  const given = Buffer.from(mac, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return "invalid";
  const age = now - Number(ts);
  if (age < 0) return "invalid";
  if (age < minAgeMs) return "too-fast";
  if (age > maxAgeMs) return "expired";
  return "ok";
}
