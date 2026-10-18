// Rauchtest gegen einen laufenden Server (Dev oder `next start`).
// Aufruf: BASE_URL=http://localhost:3100 npm run smoke
// Versendet KEINE Mails: Der Server muss im Trockenlauf laufen (kein SMTP_HOST / MAIL_SEND_ENABLED≠true).
import { redirects } from "../src/content/redirects.ts";
import { services } from "../src/content/services.ts";

const BASE = (process.env.BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
let failed = 0;
const ok = (cond, label, extra = "") => {
  console.log(`${cond ? "✓" : "✗"} ${label}${extra ? "  " + extra : ""}`);
  if (!cond) failed++;
};

const get = (path, init = {}) => fetch(BASE + path, { redirect: "manual", ...init });

// 1) Seiten liefern 200 + sinnvolle SEO-Grundlagen
const pages = ["/", "/coaching", ...services.map((s) => `/coaching/${s.slug}`), "/ueber-mich", "/kontakt", "/impressum", "/datenschutz", "/agb", "/kasse"];
for (const p of pages) {
  const res = await get(p);
  const html = await res.text();
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
  const canonical = /<link rel="canonical" href="[^"]+"/.test(html);
  const title = /<title>[^<]{10,}<\/title>/.test(html);
  const desc = /<meta name="description" content="[^"]{50,}"/.test(html);
  ok(res.status === 200 && h1s === 1 && canonical && title && desc, `GET ${p}`, `status=${res.status} h1=${h1s} canonical=${canonical} title=${title} desc=${desc}`);
}

// 2) 404
ok((await get("/gibt-es-nicht")).status === 404, "GET /gibt-es-nicht → 404");

// 3) Weiterleitungen: genau ein Sprung auf eine 200-Seite (mit und ohne Slash)
for (const r of redirects) {
  const base = r.source.replace("{/}?", "").replace("/:slug*", "/irgendein-produkt");
  for (const path of [base, base + "/"]) {
    const res = await get(path);
    const loc = res.headers.get("location") ?? "";
    const target = loc.replace(BASE, "");
    const final = await get(target);
    ok([301, 308].includes(res.status) && target === r.destination && final.status === 200, `Redirect ${path} → ${r.destination}`, `status=${res.status} location=${loc}`);
  }
}

// 4) Sicherheits-Header
const home = await get("/");
for (const h of ["content-security-policy", "x-content-type-options", "x-frame-options", "referrer-policy", "strict-transport-security"]) {
  ok(home.headers.has(h), `Header ${h}`);
}
ok(!home.headers.has("x-powered-by"), "kein X-Powered-By");

// 5) robots/sitemap
const robots = await (await get("/robots.txt")).text();
ok(/User-Agent/i.test(robots), "robots.txt vorhanden");
const sitemap = await (await get("/sitemap.xml")).text();
ok(pages.filter((p) => !["/impressum", "/datenschutz", "/agb", "/kasse"].includes(p)).every((p) => sitemap.includes(`${p === "/" ? "" : p}</loc>`)), "sitemap.xml enthält alle Seiten");

// 6) Kontakt-API
const tokenRes = await get("/api/contact/token");
const { token } = await tokenRes.json();
ok(typeof token === "string" && token.includes("."), "Token-Endpunkt liefert Token");
const post = (body, headers = {}) =>
  get("/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: BASE, ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const valid = { name: "Smoke Test", email: "smoke@example.com", phone: "", salon: "", topic: "sonstiges", message: "Automatischer Rauchtest ohne Mailversand.", consent: true, website: "", token };
ok((await post(valid, { origin: "https://evil.example" })).status === 403, "API: fremde Origin → 403");
ok((await post("{kaputt")).status === 400, "API: kaputtes JSON → 400");
ok((await post({ ...valid, email: "x" })).status === 422, "API: Validierung → 422");
ok((await get("/api/contact")).status === 405, "API: GET → 405");
const tooFast = await post(valid);
ok(tooFast.status === 400, "API: sofortiges Absenden (Zeitsperre) → 400", `status=${tooFast.status}`);
await new Promise((r) => setTimeout(r, 3300));
const good = await post(valid);
const goodJson = await good.json();
ok(good.status === 200 && goodJson.ok === true, "API: gültige Anfrage → 200", `mode=${goodJson.mode}`);
ok(goodJson.mode === "dry-run" || process.env.ALLOW_SEND === "true", "API: läuft im Trockenlauf (kein echter Versand)");

// 7) Checkout-API: ohne Stripe-Schlüssel 503, Webhook ohne Signatur nicht annehmbar
const co = await get("/api/checkout", {
  method: "POST",
  headers: { "content-type": "application/json", origin: BASE },
  body: JSON.stringify({ items: [{ slug: "einzelcoaching", quantity: 1 }], accepted: true }),
});
ok([503, 200].includes(co.status), "API /api/checkout reagiert (503 ohne Schlüssel)", `status=${co.status}`);
ok((await get("/api/checkout")).status === 405, "API /api/checkout: GET → 405");
const wh = await get("/api/stripe/webhook", { method: "POST", body: "{}" });
ok([400, 503].includes(wh.status), "Webhook ohne Signatur wird abgelehnt", `status=${wh.status}`);

// 8) Backend ist ohne Login gesperrt
const adminRes = await get("/admin");
ok([302, 307, 308].includes(adminRes.status) && (adminRes.headers.get("location") ?? "").includes("/admin/login"), "Backend /admin ohne Login → Weiterleitung auf Login", `status=${adminRes.status}`);
ok((await get("/admin/login")).status === 200, "Backend-Login erreichbar");
ok((await get("/admin/export/anfragen")).status === 401, "Backend-CSV ohne Login → 401");
ok((await get("/admin/anfragen/1")).status !== 200, "Backend-Detailseite ohne Login nicht abrufbar");
ok(/noindex/i.test((await get("/admin/login")).headers.get("x-robots-tag") ?? ""), "Backend sendet X-Robots-Tag noindex");

console.log(failed ? `\n${failed} Prüfung(en) fehlgeschlagen.` : "\nAlle Prüfungen bestanden.");
process.exit(failed ? 1 : 0);
