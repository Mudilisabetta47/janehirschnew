# Jane Hirsch – Website-Neuaufbau

Individuell programmierte Website für **jane-hirsch.de** (Brautstyling-Coaching, Make-up Artist). Next.js · React · TypeScript · Tailwind CSS · Motion. Kein WordPress, kein Baukasten.

> **Status: Staging-Vorschau – nicht veröffentlicht.** Die Live-Website, DNS, Datenbanken und der WordPress-Shop wurden nicht berührt. Die Veröffentlichung erfolgt erst nach ausdrücklicher Freigabe.

## Schnellstart
```bash
npm install
cp .env.example .env.local      # SMTP bleibt leer → Formular im Trockenlauf, es wird nichts versendet
npm run dev -- -p 3100          # http://localhost:3100
```
Produktionsvorschau: `npm run build && npm start`. Alle Prüfungen: `npm run check`. Rauchtest gegen laufenden Server: `BASE_URL=http://localhost:3100 npm run smoke`.

## Dokumentation (`docs/`)
| Datei | Inhalt |
|---|---|
| `00-designkonzept.md` | Designidee, Markenableitung, Bewegung, Barrierefreiheit |
| `01-bestandsaufnahme.md` | Seiten, Funktionen, Angebote, SEO, Mängel und Widersprüche der alten Seite |
| `02-technik.md` | Architektur, Formular-Sicherheit, Staging/Deployment |
| `03-redirects.md` | Weiterleitungsübersicht alter WordPress-URLs (erzeugt) |
| `04-offene-fragen.md` | **Offene Fragen und fehlende Originalinhalte** |

## Inhalte pflegen
Alle Texte, Preise, Kontaktdaten: `src/content/*.ts`. Fotos: Dateien nach `public/images/`, dann in `src/content/images.ts` eintragen. Stimmen: `src/content/testimonials.ts`. Alte URLs: `src/content/redirects.ts`, danach `npm run redirects:export`.

## Prüfergebnisse
Siehe Abschnitt unten (Stand der Auslieferung).

### Stand 17.10.2026 (Produktionsbuild, lokal)
| Prüfung | Ergebnis |
|---|---|
| `tsc --noEmit` (strict) | ✓ keine Fehler |
| ESLint (next/core-web-vitals + TS) | ✓ keine Meldungen |
| Vitest (Kontakt-Backend: Schema, Token, Rate-Limit, Origin, Honeypot, Header-Injection, Ende-zu-Ende ohne Versand) | ✓ 19/19 |
| `next build` | ✓ 18 Routen |
| Rauchtest (`npm run smoke`): 12 Seiten (je 1 × `<h1>`, Canonical, Title, Description), 404, **27 Weiterleitungen je mit/ohne Slash = genau 1 Sprung**, Sicherheits-Header, robots/sitemap, API-Abwehr | ✓ alle bestanden |
| Lighthouse mobil (simuliert, 4× CPU/langsames 4G), Startseite / Angebotsseite | Start 98 · Gruppencoaching 88 (mit Fotos) · Accessibility **100** · Best Practices 100 / 96 · CLS 0 · TBT 0 ms · gemessene LCP < 0,1 s (simulierte Drosselung: 2,4–4,0 s) |
| SEO-Score 66 | ausschließlich wegen `noindex` im Staging (`SITE_NOINDEX=true`) – alle anderen SEO-Prüfungen bestanden; mit `SITE_NOINDEX=false` live → 100 erwartet |
| Externe Requests im Browser | 0 (keine Drittanbieter, keine Cookies) |

Nicht getestet: echter E-Mail-Versand (bewusst – keine Freigabe, kein SMTP), reale Geräte, Screenreader-Praxistest, Safari/Firefox.
