// Erzeugt aus src/content/redirects.ts die Doku (docs/03-redirects.md) und eine
// Apache-Variante (deploy/redirects.htaccess) für den Fall, dass vorübergehend
// nur der alte Webspace/ein Reverse-Proxy mit .htaccess zur Verfügung steht.
// Aufruf: npm run redirects:export
import { writeFileSync } from "node:fs";
import { redirects } from "../src/content/redirects.ts";

const toRegex = (source) =>
  "^" +
  source
    .replace("{/}?", "/?")
    .replace(/\/:[a-z]+\*/, "(?:/.*)?")
    .replace(/[.]/g, "\\.") +
  "$";

const rows = redirects.map((r) => `| \`${r.source.replace("{/}?", "")}\` | \`${r.destination}\` | ${r.note ?? ""} |`);
const md = `# 03 · Weiterleitungen alter WordPress-URLs

Alle Weiterleitungen sind **permanent (308)** und in \`src/content/redirects.ts\` gepflegt (einzige Quelle der Wahrheit).
Der alte Pfad funktioniert mit und ohne Schrägstrich am Ende, es entsteht immer nur *ein* Sprung.
Diese Datei wird mit \`npm run redirects:export\` erzeugt – nicht von Hand ändern.

| Alte URL (WordPress) | Neue URL | Hinweis |
|---|---|---|
${rows.join("\n")}

## Nicht weitergeleitet / entfällt

- \`/wp-content/uploads/…\` (Bilder, PDFs): keine Entsprechung, Bilder werden nicht übernommen (Nutzungsrechte offen).
- \`/wp-json/…\`, \`/feed\`, \`/xmlrpc.php\`, \`/wp-admin\`: WordPress-Technik, entfällt.
- \`/sitemap.rss\`, Plugin-Sitemaps (\`product-sitemap.xml\` u. a.): ersetzt durch \`/sitemap.xml\`.
- Weitere Theme-/Plugin-Archive (\`/team/…\`, \`/testimonials/…\`, \`/cpt_…\`): im Bestand ohne Inhalt.

## Vor dem Umzug prüfen

1. Search Console der alten Domain: Welche URLs haben tatsächlich Impressionen/Backlinks? Fehlende Pfade hier ergänzen.
2. Nach dem Umzug: Crawl (z. B. Screaming Frog) der alten URL-Liste → alle müssen mit **einem** 308 auf eine 200-Seite zeigen.
3. Adressänderung in der Search Console melden, falls sich die Domain ändert.
`;
writeFileSync(new URL("../docs/03-redirects.md", import.meta.url), md);

const htaccess = `# Apache-Variante der Weiterleitungen (erzeugt aus src/content/redirects.ts)
# Nur nötig, wenn die neue Seite hinter einem Apache/Proxy läuft, der nicht Next.js ist.
<IfModule mod_alias.c>
${redirects.map((r) => `RedirectMatch 308 "${toRegex(r.source)}" "${r.destination}"`).join("\n")}
</IfModule>
`;
writeFileSync(new URL("../deploy/redirects.htaccess", import.meta.url), htaccess);
console.log(`${redirects.length} Weiterleitungen exportiert.`);
