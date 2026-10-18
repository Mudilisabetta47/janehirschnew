import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Passwort-Hash im Format `scrypt:N:r:p:salt:hash` (hex). Bewusst Doppelpunkte statt `$`: dotenv würde `$…` in
 * .env-Dateien als Variable auflösen und den Hash zerstören. Keine externen Abhängigkeiten.
 */
const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 32;

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, KEYLEN, { N, r: R, p: P });
  return `scrypt:${N}:${R}:${P}:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, saltHex, hashHex] = parts as [string, string, string, string, string, string];
  if (!/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(hashHex)) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(plain, Buffer.from(saltHex, "hex"), expected.length, { N: Number(n), r: Number(r), p: Number(p) });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
