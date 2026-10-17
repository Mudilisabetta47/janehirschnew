# 03 · Weiterleitungen alter WordPress-URLs

Alle Weiterleitungen sind **permanent (308)** und in `src/content/redirects.ts` gepflegt (einzige Quelle der Wahrheit).
Der alte Pfad funktioniert mit und ohne Schrägstrich am Ende, es entsteht immer nur *ein* Sprung.
Diese Datei wird mit `npm run redirects:export` erzeugt – nicht von Hand ändern.

| Alte URL (WordPress) | Neue URL | Hinweis |
|---|---|---|
| `/our-services` | `/coaching` | Mein Service |
| `/einzelcoaching1` | `/coaching/einzelcoaching` |  |
| `/product/einzelcoaching-2` | `/coaching/einzelcoaching` | Shop-Produkt |
| `/gruppencoaching` | `/coaching/gruppencoaching` |  |
| `/product/gruppencoaching` | `/coaching/gruppencoaching` | Shop-Produkt |
| `/saloncoaching` | `/coaching/saloncoaching` |  |
| `/product/saloncoaching` | `/coaching/saloncoaching` | Shop-Produkt |
| `/watch-learn` | `/coaching/watch-and-learn` |  |
| `/services/watch-learn` | `/coaching/watch-and-learn` | Doppelter Pfad im Bestand |
| `/product/watch-learn` | `/coaching/watch-and-learn` | Shop-Produkt |
| `/braut-make-up-coaching` | `/coaching/braut-make-up-coaching` |  |
| `/product/braut-make-up-coaching` | `/coaching/braut-make-up-coaching` | Shop-Produkt |
| `/online-coaching` | `/coaching/online-coaching` |  |
| `/product/online-coaching` | `/coaching/online-coaching` | Shop-Produkt |
| `/kontaktiere-mich` | `/kontakt` |  |
| `/angebotsanfrage` | `/kontakt` | YITH-Anfrage ersetzt durch Kontaktformular |
| `/privacy-policy` | `/datenschutz` | Alter Text stammte vom Theme-Hersteller |
| `/shop` | `/coaching` | Shop → Angebotsübersicht |
| `/warenkorb` | `/kasse` | Alter WooCommerce-Warenkorb → neue Kasse |
| `/checkout` | `/kasse` | Alte WooCommerce-Kasse → neue Kasse |
| `/my-account` | `/coaching` | Shop entfällt |
| `/product/:slug*` | `/coaching` | Übrige Produkte |
| `/product-category/:slug*` | `/coaching` |  |
| `/typography` | `/` |  |
| `/evercompare` | `/coaching` |  |
| `/luxury-beauty-salon-2` | `/` |  |
| `/services/:slug*` | `/coaching` | Theme-Custom-Post-Type |

## Nicht weitergeleitet / entfällt

- `/wp-content/uploads/…` (Bilder, PDFs): keine Entsprechung, Bilder werden nicht übernommen (Nutzungsrechte offen).
- `/wp-json/…`, `/feed`, `/xmlrpc.php`, `/wp-admin`: WordPress-Technik, entfällt.
- `/sitemap.rss`, Plugin-Sitemaps (`product-sitemap.xml` u. a.): ersetzt durch `/sitemap.xml`.
- Weitere Theme-/Plugin-Archive (`/team/…`, `/testimonials/…`, `/cpt_…`): im Bestand ohne Inhalt.

## Vor dem Umzug prüfen

1. Search Console der alten Domain: Welche URLs haben tatsächlich Impressionen/Backlinks? Fehlende Pfade hier ergänzen.
2. Nach dem Umzug: Crawl (z. B. Screaming Frog) der alten URL-Liste → alle müssen mit **einem** 308 auf eine 200-Seite zeigen.
3. Adressänderung in der Search Console melden, falls sich die Domain ändert.
