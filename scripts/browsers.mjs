// Browser-übergreifender Test (Chromium, WebKit/Safari, Firefox) gegen einen laufenden Server.
// Aufruf: BASE_URL=http://localhost:3100 SHOTS=/pfad/zu/screenshots npm run test:browsers
// Prüft je Engine und Bildschirmgröße: Seiten laden ohne Fehler, kein seitliches Überlaufen,
// Warenkorb-Ablauf, Kasse mit Validierung, Kontaktformular (Trockenlauf – es wird nichts versendet).
import { chromium, webkit, firefox } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const SHOTS = process.env.SHOTS ?? "";
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const engines = { chromium, webkit, firefox };
const sizes = { desktop: { width: 1440, height: 900 }, mobil: { width: 390, height: 844 } };
const pages = ["/", "/coaching", "/coaching/einzelcoaching", "/coaching/gruppencoaching", "/coaching/online-coaching", "/ueber-mich", "/kontakt", "/kasse", "/agb", "/datenschutz", "/impressum"];

let failed = 0;
const ok = (cond, label, extra = "") => {
  console.log(`${cond ? "✓" : "✗"} ${label}${extra ? "  " + extra : ""}`);
  if (!cond) failed++;
};

for (const [name, engine] of Object.entries(engines)) {
  const browser = await engine.launch();
  for (const [sizeName, viewport] of Object.entries(sizes)) {
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, locale: "de-DE", hasTouch: sizeName === "mobil" });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
    page.on("console", (m) => {
      if (m.type() === "error" && !/Failed to load resource.*(404|503)/.test(m.text())) errors.push(`console: ${m.text().slice(0, 140)}`);
    });
    const tag = `${name}/${sizeName}`;

    for (const path of pages) {
      errors.length = 0;
      const res = await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.waitForTimeout(700);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const h1 = await page.locator("h1").count();
      ok(res?.status() === 200 && overflow <= 1 && h1 === 1 && errors.length === 0, `${tag} ${path}`, `status=${res?.status()} overflow=${overflow} h1=${h1} ${errors[0] ?? ""}`);
      if (SHOTS && ["/", "/coaching/einzelcoaching", "/kasse"].includes(path)) {
        await page.screenshot({ path: `${SHOTS}/${name}-${sizeName}-${path === "/" ? "home" : path.slice(1).replace(/\//g, "_")}.png` });
      }
    }

    // Header bleibt nach dem Scrollen lesbar (heller Hintergrund, dunkler Text) – auf Start und Angebotsseiten
    for (const path of ["/", "/coaching/einzelcoaching"]) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      await page.evaluate(() => window.scrollTo({ top: 1400, behavior: "instant" }));
      await page.waitForTimeout(900);
      const hdr = await page.evaluate(() => {
        const h = document.querySelector("header");
        const cs = getComputedStyle(h);
        return { bg: cs.backgroundColor, color: cs.color };
      });
      ok(hdr.bg !== "rgba(0, 0, 0, 0)" && !/^rgb\(25[01], 24[0-9]/.test(hdr.color), `${tag} Header nach Scroll lesbar ${path}`, `${hdr.bg} / ${hdr.color}`);
    }

    // Warenkorb: Angebot hinzufügen → Schublade → Kasse
    await page.goto(BASE + "/coaching/gruppencoaching", { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("jh-cart-v1"));
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "In den Warenkorb" }).click();
    const drawer = page.getByRole("dialog", { name: "Warenkorb" });
    await drawer.waitFor({ state: "visible", timeout: 5000 });
    ok(await drawer.getByText("1.069,81").first().isVisible(), `${tag} Warenkorb-Schublade zeigt Summe`);
    if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}-${sizeName}-warenkorb.png` });
    await drawer.getByRole("button", { name: "Mehr" }).click();
    ok(await drawer.getByText("2.139,62").first().isVisible(), `${tag} Menge erhöhen → neue Summe`);
    await page.keyboard.press("Escape");
    await drawer.waitFor({ state: "hidden", timeout: 5000 });
    const badge = await page.getByRole("button", { name: /Warenkorb, \d+ Artikel/ }).first().getAttribute("aria-label");
    ok(/2 Artikel/.test(badge ?? ""), `${tag} Header-Zähler`, badge ?? "");

    await page.goto(BASE + "/kasse", { waitUntil: "networkidle" });
    ok(await page.getByText("Gesamt (brutto)").first().isVisible(), `${tag} Kasse zeigt Bestellung`);
    await page.getByRole("button", { name: "Weiter zur Zahlung" }).click();
    await page.waitForTimeout(400);
    ok((await page.locator('[id$="-err"]').count()) >= 5, `${tag} Kasse validiert leere Pflichtfelder`);
    await page.evaluate(() => localStorage.removeItem("jh-cart-v1"));

    // Kontaktformular (Trockenlauf)
    await page.goto(BASE + "/kontakt?thema=saloncoaching", { waitUntil: "networkidle" });
    const form = page.getByRole("form", { name: "Kontaktformular" });
    await form.getByLabel(/Vor- & Nachname/).fill("Browser Test");
    await form.getByLabel(/E-Mail-Adresse/).fill("browser@example.com");
    await form.getByLabel(/Nachricht/).fill("Automatischer Browsertest ohne Mailversand.");
    await form.getByLabel(/Datenschutzhinweise/).check();
    await page.waitForTimeout(3300);
    await form.getByRole("button", { name: "Anfrage senden" }).click();
    await page.getByRole("status").waitFor({ timeout: 6000 }).catch(() => {});
    ok(await page.getByText("Danke dir").first().isVisible().catch(() => false), `${tag} Kontaktformular → Erfolg (Trockenlauf)`);

    await ctx.close();
  }
  await browser.close();
}
console.log(failed ? `\n${failed} Prüfung(en) fehlgeschlagen.` : "\nAlle Browser-Prüfungen bestanden.");
process.exit(failed ? 1 : 0);
