# 02 · Technik & Betrieb

## Stack
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript (strict, `noUncheckedIndexedAccess`) · Tailwind CSS 4 · `motion` (Framer Motion) · Zod 4 · Nodemailer · Vitest. Kein WordPress, keine Baukasten-/Template-Abhängigkeit.

## Struktur
```
src/app/            Routen (Seiten, Sitemap, robots, OG-Bild, API)
src/components/     ui/ · layout/ · sections/ · forms/ · motion/ · legal/
src/content/        ALLE Inhalte (site, services, about, redirects, images, testimonials)
src/lib/            seo.ts · contact/ (schema, token, rateLimit, mail, handler)
scripts/            smoke.mjs (Rauchtest) · export-redirects.mjs
tests/              Vitest (Kontakt-Backend)
docs/ deploy/       Dokumentation · Apache-Redirects
```
Inhalte stehen getrennt vom Layout: Texte/Preise ändern = nur `src/content/*.ts` anfassen.

## Befehle
| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run check` | Typecheck + Lint + Tests + Produktions-Build |
| `npm run build && npm start` | Produktionsvorschau |
| `BASE_URL=http://localhost:3100 npm run smoke` | Rauchtest (Seiten, SEO-Basis, Redirects, Header, API) |
| `npm run redirects:export` | Redirect-Doku und `.htaccess` neu erzeugen |

## Kontaktformular – Sicherheitsmodell
1. **Serverseitige Validierung** (Zod, gleiches Schema wie im Browser), Steuerzeichen werden entfernt, Längen begrenzt, Body ≤ 16 KB.
2. **Honeypot** (verstecktes Feld) – Bots erhalten scheinbaren Erfolg, es passiert nichts.
3. **Signiertes Zeit-Token** (HMAC-SHA256, `FORM_SECRET`): Absenden < 3 s oder > 2 h nach Ausgabe wird abgelehnt. Kein Cookie.
4. **Rate-Limit** pro Client (Standard 5 / 15 min) + Gesamtdeckel; `429` mit `Retry-After`.
5. **Origin-/Content-Type-Prüfung** (nur gleiche Herkunft, nur JSON).
6. **Header-Injection-Schutz** in Betreff/Reply-To; Mail nur als Plaintext.
7. **Keine Schlüssel im Frontend**; SMTP-Daten nur serverseitig per Umgebungsvariablen.
8. **Datensparsam**: keine Speicherung auf dem Server, IP nur kurz im RAM für das Limit, keine IP in der Mail.
9. **Trockenlauf als Standard**: Versand nur, wenn `SMTP_HOST`, `CONTACT_TO`, `CONTACT_FROM` gesetzt **und** `MAIL_SEND_ENABLED=true`. Sonst zeigt die Erfolgsmeldung einen deutlichen Vorschau-Hinweis.

Grenzen: Das Rate-Limit liegt im Prozessspeicher. Bei mehreren Instanzen/Serverless → Redis/Upstash ergänzen. Hinter einem Reverse-Proxy `TRUST_PROXY=true` setzen, damit die Client-IP aus `X-Forwarded-For` gelesen wird (nur wenn der Proxy den Header überschreibt!).

## Warenkorb & Checkout
- Warenkorb im Browser (`localStorage`, nur Angebots-Kennung + Menge, beim Laden gegen die Inhalte geprüft). Header-Button mit Zähler, Schublade, Kasse unter `/kasse`.
- Preise werden **nie** vom Client übernommen: `/api/checkout` berechnet alles aus `src/content/services.ts` (`quoteCart`), legt den Stripe-Kunden mit Name/Anschrift an und erzeugt die Zahlungssitzung. Webhook `/api/stripe/webhook` benachrichtigt Jane nach bezahlter Sitzung.
- Aus, bis `STRIPE_SECRET_KEY` gesetzt ist; Anzeige der Buchung per `NEXT_PUBLIC_CHECKOUT_ENABLED`.

## Backend (Anfragen, Bestellungen, Kundenservice)
- **Speicher:** SQLite-Datei `$DATA_DIR/jane.db` (Node ≥ 22.5, eingebautes `node:sqlite`, keine native Abhängigkeit). Tabellen: `inquiries`, `orders`, `activity`. Das Verzeichnis muss auf dem Hosting **persistent** sein (nicht bei jedem Deploy neu angelegt) und gesichert werden (Dateikopie genügt). `STORE_ENABLED=false` schaltet die Speicherung ab.
- **Nichts geht verloren:** Das Kontaktformular speichert zuerst, mailt danach. Scheitert die Mail, bleibt die Anfrage im Backend sichtbar (Mailstatus „fehlgeschlagen“). Der Stripe-Webhook speichert Bestellungen idempotent über die Sitzungs-ID, benachrichtigt nur beim Übergang auf „bezahlt“ und verarbeitet `async_payment_failed` und `charge.refunded`.
- **Zugang:** `/admin` mit Passwort (scrypt-Hash in `ADMIN_PASSWORD_HASH`, erzeugen mit `npm run admin:hash`), signiertes Sitzungs-Cookie (httpOnly, SameSite=Strict, Secure in Produktion, 8 h), Login-Drosselung (5 Versuche / 15 min), `noindex` + `no-store`, in `robots.txt` gesperrt. Besucher erhalten kein Cookie.
- **Funktionen:** Übersicht mit Kennzahlen und „Bereitschafts-Check“, Anfragen und Bestellungen mit Suche/Filter, Status, interne Notizen, Verlaufsprotokoll, Antwort-Vorlagen (öffnen das Mailprogramm), Löschen auf Wunsch, CSV-Export (Excel-tauglich, gegen Formel-Einschleusung geschützt).
- **Datenschutz:** Erledigte/Spam-Anfragen werden nach `RETENTION_INQUIRY_DAYS` (Standard 180) automatisch gelöscht; Bestellungen bleiben (gesetzliche Aufbewahrung).
- **Stripe-Webhook abonnieren:** `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`.
- **Grenzen:** SQLite = ein Server. Bei mehreren Instanzen/Serverless auf Postgres umstellen (nur `src/lib/db/` ist betroffen). Rate-Limits liegen im Arbeitsspeicher (siehe oben).

## Sicherheits-Header
CSP (nur eigene Quellen, kein Drittanbieter), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy; `X-Powered-By` entfernt.

## SEO
Eigener Title/Description/Canonical/OG/Twitter je Seite, OG-Bild (generiert), `sitemap.xml`, `robots.txt`, JSON-LD (`WebSite`, `Person`, `Service` mit Preis, `FAQPage`, `BreadcrumbList`), genau ein `<h1>` je Seite, `lang="de"`. Impressum/Datenschutz sind `noindex,follow`. Mit `SITE_NOINDEX=true` (Staging) sperrt `robots.txt` alles und alle Seiten sind `noindex`.

## Staging / Deployment
Die Seite braucht eine **Node-Umgebung** (wegen API-Route und Header/Redirects), z. B. Node-Hosting, VPS oder Container (`npm ci && npm run build && npm start`). Reiner Apache-/Shared-Webspace ohne Node reicht nicht für das Formular. Für Staging: `SITE_NOINDEX=true`, Zugriffsschutz (Basic-Auth) auf Ebene des Hosters, SMTP leer lassen. **Es wurde nichts deployed und keine DNS-/Live-Änderung vorgenommen.**

## Messwerte (lokal, Produktionsbuild, Lighthouse mobil mit Drosselung)
Siehe `README.md` → „Prüfergebnisse“.
