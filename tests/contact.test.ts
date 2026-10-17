import { describe, expect, it, beforeEach } from "vitest";
import { contactSchema } from "@/lib/contact/schema";
import { createToken, verifyToken } from "@/lib/contact/token";
import { RateLimiter } from "@/lib/contact/rateLimit";
import { buildMessage, headerSafe } from "@/lib/contact/mail";
import { clientKey, handleContact, isSameOrigin } from "@/lib/contact/handler";
import { getSecret } from "@/lib/contact/config";

const SECRET = "x".repeat(40);
const T0 = 1_700_000_000_000;
const valid = (over: Record<string, unknown> = {}) => ({
  name: "Anna Beispiel",
  email: "Anna@Example.com ",
  phone: "+49 170 1234567",
  salon: "",
  topic: "einzelcoaching",
  message: "Ich interessiere mich für ein Einzelcoaching im Frühjahr.",
  consent: true,
  website: "",
  token: createToken(SECRET, Date.now() - 10_000),
  ...over,
});

describe("Schema", () => {
  it("akzeptiert gültige Daten und normalisiert", () => {
    const r = contactSchema.safeParse(valid());
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("anna@example.com");
  });
  it.each([
    ["name", ""],
    ["email", "kein-mail"],
    ["message", "kurz"],
    ["topic", "gibtsnicht"],
    ["consent", false],
    ["phone", "abc; DROP TABLE"],
  ])("lehnt ungültiges Feld %s ab", (field, value) => {
    expect(contactSchema.safeParse(valid({ [field]: value })).success).toBe(false);
  });
  it("entfernt Steuerzeichen aus Namen", () => {
    const r = contactSchema.parse(valid({ name: "Anna\r\nBcc: evil@x.de" }));
    expect(r.name).not.toMatch(/[\r\n]/);
  });
});

describe("Token", () => {
  it("akzeptiert ein gültiges, ausreichend altes Token", () => {
    expect(verifyToken(createToken(SECRET, T0), SECRET, { now: T0 + 10_000 })).toBe("ok");
  });
  it("erkennt zu schnelle, abgelaufene und gefälschte Tokens", () => {
    expect(verifyToken(createToken(SECRET, T0), SECRET, { now: T0 + 1_000 })).toBe("too-fast");
    expect(verifyToken(createToken(SECRET, T0), SECRET, { now: T0 + 3 * 3600_000 })).toBe("expired");
    expect(verifyToken(createToken("anderes".repeat(8), T0), SECRET, { now: T0 + 10_000 })).toBe("invalid");
    expect(verifyToken("müll", SECRET)).toBe("invalid");
    expect(verifyToken("1000000000000." + "a".repeat(64), SECRET)).toBe("invalid");
  });
});

describe("RateLimiter", () => {
  it("sperrt nach dem Limit und gibt nach dem Fenster wieder frei", () => {
    const rl = new RateLimiter(2, 1000);
    expect(rl.check("a", 0).allowed).toBe(true);
    expect(rl.check("a", 10).allowed).toBe(true);
    const blocked = rl.check("a", 20);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(rl.check("b", 20).allowed).toBe(true);
    expect(rl.check("a", 1100).allowed).toBe(true);
  });
});

describe("Mail", () => {
  it("verhindert Header-Injection im Betreff", () => {
    expect(headerSafe("Hallo\r\nBcc: x@y.de")).not.toMatch(/[\r\n]/);
    const data = contactSchema.parse(valid({ name: "Eve\nBcc: x@y.de" }));
    expect(buildMessage(data).subject).not.toMatch(/[\r\n]/);
  });
});

describe("Origin & Client-Key", () => {
  it("erlaubt nur gleiche Herkunft", () => {
    expect(isSameOrigin(new Headers({ origin: "https://a.de", host: "a.de" }))).toBe(true);
    expect(isSameOrigin(new Headers({ origin: "https://evil.com", host: "a.de" }))).toBe(false);
    expect(isSameOrigin(new Headers({ host: "a.de" }))).toBe(false);
    expect(isSameOrigin(new Headers({ host: "a.de", "sec-fetch-site": "same-origin" }))).toBe(true);
  });
  it("vertraut Proxy-Headern nur bei TRUST_PROXY", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8", "user-agent": "t" });
    expect(clientKey(h, true)).toBe("ip:1.2.3.4");
    expect(clientKey(h, false)).toMatch(/^ua:/);
  });
});

describe("handleContact (Ende-zu-Ende ohne Versand)", () => {
  beforeEach(() => {
    delete process.env.SMTP_HOST;
    delete process.env.MAIL_SEND_ENABLED;
    process.env.FORM_SECRET = SECRET;
    process.env.RATE_LIMIT_MAX = "1000";
    (globalThis as { __contactLimiter?: unknown; __contactGlobal?: unknown }).__contactLimiter = undefined;
    (globalThis as { __contactLimiter?: unknown; __contactGlobal?: unknown }).__contactGlobal = undefined;
  });

  const req = (body: unknown, extra: Record<string, string> = {}) =>
    new Request("https://a.de/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://a.de", host: "a.de", ...extra },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });

  it("liefert im Trockenlauf Erfolg ohne zu versenden", async () => {
    const res = await handleContact(req(valid({ token: createToken(getSecret(), Date.now() - 10_000) })));
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true, mode: "dry-run" });
  });
  it("antwortet Bots (Honeypot) scheinbar erfolgreich", async () => {
    const res = await handleContact(req(valid({ website: "http://spam.example" })));
    expect(res.status).toBe(200);
  });
  it("lehnt fremde Herkunft, falschen Typ, kaputtes JSON und Validierungsfehler ab", async () => {
    expect((await handleContact(req(valid(), { origin: "https://evil.com" }))).status).toBe(403);
    expect((await handleContact(req(valid(), { "content-type": "text/plain" }))).status).toBe(415);
    expect((await handleContact(req("{kaputt"))).status).toBe(400);
    const v = await handleContact(req(valid({ email: "x" })));
    expect(v.status).toBe(422);
    expect(v.body.ok === false && v.body.fieldErrors?.email).toBeTruthy();
  });
  it("lehnt zu schnelles und gefälschtes Token ab", async () => {
    expect((await handleContact(req(valid({ token: createToken(getSecret(), Date.now()) })))).status).toBe(400);
    expect((await handleContact(req(valid({ token: createToken("falsch".repeat(8), Date.now() - 10_000) })))).status).toBe(400);
  });
  it("drosselt nach Überschreiten des Limits mit 429 und Retry-After", async () => {
    process.env.RATE_LIMIT_MAX = "2";
    (globalThis as { __contactLimiter?: unknown; __contactGlobal?: unknown }).__contactLimiter = undefined;
    (globalThis as { __contactLimiter?: unknown; __contactGlobal?: unknown }).__contactGlobal = undefined;
    const ok = () => handleContact(req(valid({ token: createToken(getSecret(), Date.now() - 10_000) })));
    expect((await ok()).status).toBe(200);
    expect((await ok()).status).toBe(200);
    const third = await ok();
    expect(third.status).toBe(429);
    expect(third.headers?.["Retry-After"]).toBeTruthy();
  });
});
