// Ende-zu-Ende-Test des Backends gegen einen laufenden Server (Chromium).
// Voraussetzung: Server läuft mit ADMIN_PASSWORD_HASH (zum Passwort passend), STRIPE_SECRET_KEY=sk_test_dummy,
// STRIPE_WEBHOOK_SECRET=whsec_dummy und einem leeren DATA_DIR. Es werden KEINE Mails versendet und KEIN Stripe-Netzwerkaufruf gemacht.
// Aufruf: BASE_URL=http://localhost:3101 ADMIN_TEST_PASSWORD=… WEBHOOK_SECRET=whsec_dummy node scripts/backend-e2e.mjs
import { chromium } from "playwright";
import Stripe from "stripe";

const BASE = (process.env.BASE_URL ?? "http://localhost:3101").replace(/\/$/, "");
const PASSWORD = process.env.ADMIN_TEST_PASSWORD ?? "";
const WHSEC = process.env.WEBHOOK_SECRET ?? "whsec_dummy";
let failed = 0;
const ok = (cond, label, extra = "") => {
  console.log(`${cond ? "✓" : "✗"} ${label}${extra ? "  " + extra : ""}`);
  if (!cond) failed++;
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "de-DE" });
const page = await ctx.newPage();

// 1) Ohne Anmeldung kein Zugriff
await page.goto(BASE + "/admin");
ok(page.url().endsWith("/admin/login"), "Backend ohne Login → Weiterleitung auf /admin/login");
const unauth = await ctx.request.get(BASE + "/admin/export/anfragen");
ok(unauth.status() === 401, "CSV-Export ohne Login → 401", `status=${unauth.status()}`);

// 2) Falsches Passwort
await page.getByLabel("Passwort").fill("definitiv-falsch-123");
await page.getByRole("button", { name: "Anmelden" }).click();
await page.locator("p[role=alert]").waitFor({ timeout: 8000 });
ok((await page.locator("p[role=alert]").innerText()).includes("Passwort falsch"), "Falsches Passwort wird abgelehnt");

// 3) Kontaktformular → gespeichert
await page.goto(BASE + "/kontakt?thema=saloncoaching", { waitUntil: "networkidle" });
const form = page.getByRole("form", { name: "Kontaktformular" });
await form.getByLabel(/Vor- & Nachname/).fill("Erika E2E-Test");
await form.getByLabel(/E-Mail-Adresse/).fill("erika.e2e@example.com");
await form.getByLabel(/Salonname/).fill("Salon E2E");
await form.getByLabel(/Nachricht/).fill("Bitte um ein Angebot für ein Saloncoaching (E2E-Test, kein echter Kunde).");
await form.getByLabel(/Datenschutzhinweise/).check();
await page.waitForTimeout(3300);
await form.getByRole("button", { name: "Anfrage senden" }).click();
await page.getByText("Danke dir").first().waitFor({ timeout: 8000 });
ok(true, "Kontaktformular → Erfolgsmeldung");
ok((await page.getByText("keine E-Mail versendet").count()) === 0, "Kein „Vorschau“-Hinweis, weil gespeichert");

// 4) Webhook mit gültiger Signatur → Bestellung
const stripe = new Stripe("sk_test_dummy");
const session = {
  id: "cs_test_e2e_1", object: "checkout.session", payment_status: "paid", livemode: false, amount_total: 213962, payment_intent: "pi_e2e_1",
  metadata: { items: "gruppencoaching:2", net_cents: "179800", vat_cents: "34162", name: "Bruno Bestell", company: "Studio E2E", vat_id: "DE123456789", wish: "Herbst" },
  customer_details: { name: "Bruno Bestell", email: "bruno.e2e@example.com", phone: "0173 0000000", address: { line1: "Teststraße 1", postal_code: "28844", city: "Weyhe", country: "DE" } },
};
const payload = JSON.stringify({ id: "evt_e2e_1", object: "event", type: "checkout.session.completed", data: { object: session } });
const send = (body, sig) => ctx.request.post(BASE + "/api/stripe/webhook", { data: body, headers: { "content-type": "application/json", "stripe-signature": sig } });
const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WHSEC });
ok((await send(payload, "t=1,v1=00")).status() === 400, "Webhook mit falscher Signatur → 400");
ok((await send(payload, sig)).status() === 200, "Webhook mit gültiger Signatur → 200");
ok((await send(payload, stripe.webhooks.generateTestHeaderString({ payload, secret: WHSEC }))).status() === 200, "Wiederholte Zustellung → 200 (idempotent)");

// 5) Anmelden und prüfen
await page.goto(BASE + "/admin/login");
await page.getByLabel("Passwort").fill(PASSWORD);
await page.getByRole("button", { name: "Anmelden" }).click();
await page.waitForURL(BASE + "/admin", { timeout: 10000 });
await page.waitForLoadState("networkidle");
ok(await page.getByRole("heading", { name: "Übersicht" }).isVisible(), "Login → Übersicht");
ok((await page.getByText("Neue Anfragen").count()) > 0 && (await page.getByText("Bereitschaft").count()) > 0, "Übersicht zeigt Kennzahlen und Bereitschafts-Check");
const cookies = await ctx.cookies();
const c = cookies.find((x) => x.name === "jh_admin");
ok(!!c && c.httpOnly && c.sameSite === "Strict", "Sitzungs-Cookie ist httpOnly + SameSite=Strict");

// 6) Anfrage bearbeiten
await page.getByRole("link", { name: /^Anfragen/ }).first().click();
await page.getByRole("link", { name: "Erika E2E-Test" }).click();
await page.waitForURL(/\/admin\/anfragen\/\d+/);
await page.getByRole("heading", { name: "Erika E2E-Test" }).waitFor();
await page.waitForLoadState("networkidle");
ok(await page.getByText("Bitte um ein Angebot").first().isVisible(), "Anfrage-Detail zeigt Nachricht");
await page.getByLabel("Status").selectOption("in_arbeit");
await page.getByLabel("Interne Notiz").fill("Rückruf am Montag vereinbart");
await page.getByRole("button", { name: "Speichern" }).click();
await page.getByText("Gespeichert.").waitFor({ timeout: 8000 });
await page.reload();
ok((await page.getByLabel("Interne Notiz").inputValue()) === "Rückruf am Montag vereinbart", "Notiz bleibt gespeichert");
ok((await page.getByLabel("Status").inputValue()) === "in_arbeit", "Status bleibt gespeichert");
ok(await page.getByText(/Status: Neu → In Bearbeitung/).isVisible(), "Verlauf protokolliert Statuswechsel");
ok(((await page.getByRole("link", { name: "Erstgespräch vorschlagen" }).getAttribute("href")) ?? "").startsWith("mailto:"), "Antwort-Vorlagen vorhanden");

// 7) Bestellung ansehen
await page.goto(BASE + "/admin/bestellungen", { waitUntil: "networkidle" });
await page.getByRole("link", { name: "Bruno Bestell" }).click();
await page.waitForLoadState("networkidle");
await page.getByRole("heading", { name: /Bestellung \d+/ }).waitFor();
ok(await page.getByText("2 × Gruppencoaching").isVisible() && (await page.getByText("2.139,62").count()) > 0, "Bestellung zeigt Position und Bruttosumme");
ok((await page.getByText("Studio E2E").count()) > 0 && (await page.getByText("DE123456789").count()) > 0, "Bestellung zeigt Firma und USt-IdNr.");
await page.getByLabel("Status").selectOption("termin_abgestimmt");
await page.getByRole("button", { name: "Speichern" }).click();
await page.getByText("Gespeichert.").waitFor({ timeout: 8000 });
ok(true, "Bestellstatus gespeichert");

// 8) CSV
const csvA = await ctx.request.get(BASE + "/admin/export/anfragen");
const csvB = await ctx.request.get(BASE + "/admin/export/bestellungen");
ok(csvA.status() === 200 && (await csvA.text()).includes("Erika E2E-Test"), "CSV Anfragen enthält den Eintrag");
ok(csvB.status() === 200 && (await csvB.text()).includes("Bruno Bestell"), "CSV Bestellungen enthält den Eintrag");

// 9) Abmelden
await page.getByRole("button", { name: "Abmelden" }).click();
await page.waitForURL(/\/admin\/login/, { timeout: 8000 });
await page.goto(BASE + "/admin");
ok(page.url().endsWith("/admin/login"), "Nach Abmelden wieder gesperrt");

// 10) Rate-Limit beim Login
let blocked = false;
for (let i = 0; i < 7 && !blocked; i++) {
  await page.getByLabel("Passwort").fill("falsch-" + i);
  await page.getByRole("button", { name: "Anmelden" }).click();
  await page.locator("p[role=alert]").waitFor({ timeout: 8000 });
  blocked = (await page.locator("p[role=alert]").innerText()).includes("Zu viele Versuche");
}
ok(blocked, "Login wird nach zu vielen Fehlversuchen gedrosselt");

await browser.close();
console.log(failed ? `\n${failed} Prüfung(en) fehlgeschlagen.` : "\nAlle Backend-Prüfungen bestanden.");
process.exit(failed ? 1 : 0);
