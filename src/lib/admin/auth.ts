import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { RateLimiter } from "@/lib/contact/rateLimit";
import { clientKey } from "@/lib/contact/handler";
import { getConfig } from "@/lib/contact/config";
import { verifyPassword } from "./password";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_S, verifySessionToken } from "./session";

/** Backend ist nur aktiv, wenn ein Passwort-Hash gesetzt ist (ADMIN_PASSWORD_HASH). */
export const adminConfigured = (env: NodeJS.ProcessEnv = process.env) => Boolean(env.ADMIN_PASSWORD_HASH);

let ephemeral: string | undefined;
function sessionSecret(env: NodeJS.ProcessEnv = process.env): string {
  const s = env.ADMIN_SESSION_SECRET ?? env.FORM_SECRET;
  if (s && s.length >= 32) return s;
  ephemeral ??= randomBytes(32).toString("hex");
  return ephemeral;
}

const g = globalThis as unknown as { __adminLoginLimiter?: RateLimiter };
const limiter = () => (g.__adminLoginLimiter ??= new RateLimiter(5, 15 * 60 * 1000));

export type LoginResult = { ok: true } | { ok: false; message: string };

/** Prüft das Passwort (mit Begrenzung der Versuche) und setzt bei Erfolg das Sitzungs-Cookie. */
export async function loginAdmin(password: string): Promise<LoginResult> {
  if (!adminConfigured()) return { ok: false, message: "Das Backend ist noch nicht eingerichtet." };
  const h = await headers();
  const limit = limiter().check(clientKey(h, getConfig().trustProxy));
  if (!limit.allowed) return { ok: false, message: `Zu viele Versuche. Bitte in ${Math.ceil(limit.retryAfterSeconds / 60)} Min. erneut versuchen.` };
  if (!password || password.length > 200 || !verifyPassword(password, process.env.ADMIN_PASSWORD_HASH ?? "")) {
    // gleiche Verzögerung für alle Fehlversuche
    await new Promise((r) => setTimeout(r, 600));
    return { ok: false, message: "Passwort falsch." };
  }
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(sessionSecret()), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  return { ok: true };
}

export async function logoutAdmin() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  return verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value, sessionSecret());
}

/** Seiten/Aktionen im Backend: ohne gültige Sitzung → Login. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
