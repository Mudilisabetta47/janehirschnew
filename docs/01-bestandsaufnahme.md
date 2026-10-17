# 01 · Bestandsaufnahme jane-hirsch.de

Stand der Analyse: 17.10.2026 · Quelle: öffentlich abrufbare Seiten, WordPress-REST-Listing (`/wp-json/wp/v2/pages`), WooCommerce-Store-API (nur lesend). Es wurde **nichts** an der Live-Seite verändert, kein Formular abgeschickt, nichts in den Warenkorb gelegt.

> Abgrenzung: `hochzeitsstyling-jane.de` (Hochzeitsstyling, andere Website) ist **nicht** Gegenstand dieses Projekts. Es werden nur die Daten übernommen, auf die jane-hirsch.de selbst verweist (Impressum-/Datenschutz-Links, Kontakt-E-Mail im Footer).

## 1. Technischer Ist-Zustand

| Punkt | Befund |
|---|---|
| CMS | WordPress, Theme „Beautique“ (ThemeREX) + Child-Theme, Elementor / Pro Elements, CMSMasters-Addon, Revolution Slider, WooCommerce (+ Germanized, Currency Switcher, Product Options, Payments), Contact Form 7, Elementor-Formulare, Complianz (Cookie-Banner), All in One SEO 5.0.3, LoftLoader (Preloader), YITH Request-a-Quote |
| Hosting | IONOS (A-Record 217.160.0.199), Mail-MX von jane-hirsch.de: IONOS |
| Schriften live | Bebas Neue (Überschriften), Mrs Saint Delafield (Signatur-Script im Hero), Roboto / Roboto Slab, per Google Fonts nachgeladen (datenschutzrechtlich problematisch) |
| Farben live | Seite wirkt schwarz/weiß mit sehr hellem Blush (`#FFF4EE`, Creme `#FFF5E2`); die Elementor-Kit-Farben (`#6EC1E4`, `#61CE70`) sind Theme-Standardwerte und **nicht** Teil der Marke |
| Logo | Handschrift-Monogramm „J.H.“ in schwarzem Kreis (`/wp-content/uploads/2025/02/J.K-1.png`, 1188×1188 px) |
| Tracking | Kein GA/GTM/Pixel im HTML gefunden; Complianz-Banner mit nicht ausgefüllten Platzhaltern (`{vendor_count}`, `{title}`) |
| Sitemap | `sitemap.xml` (AIOSEO) listet u. a. Produkte, Templates, Team, Testimonials-Gruppen – überwiegend Theme-Altlasten |
| robots.txt | Standard-WooCommerce-Sperren, zwei Sitemap-Einträge (`sitemap.xml`, `sitemap.rss`) |

## 2. Seiten & URLs (veröffentlicht)

| Alte URL | Titel (WP) | Inhalt / Funktion | Neue URL |
|---|---|---|---|
| `/` | Startseite · „Jane Hirsch \| JH Coaching“ | Hero (Slider), Service-Kacheln (6), Expertise-Zähler (leer: „0+“), Teilnehmer-Karussell „Das sagen meine Teilnehmer“ (5 Nachrichten als Bilder; erst später korrekt erkannt), CTA | `/` |
| `/our-services/` | Mein Service | 6 Angebote mit Preisen | `/coaching` |
| `/einzelcoaching1/` (+ `/product/einzelcoaching-2/`) | Einzelcoaching | Detailseite, FAQ, Formular, Shop-Produkt 899 € | `/coaching/einzelcoaching` |
| `/gruppencoaching/` (+ `/product/gruppencoaching/`) | Gruppencoaching | Detailseite, FAQ, Formular, Shop-Produkt 849 € | `/coaching/gruppencoaching` |
| `/saloncoaching/` (+ `/product/saloncoaching/`) | Saloncoaching | Detailseite, FAQ, Formular (mit „Salonname“), Shop-Produkt 1.200 € | `/coaching/saloncoaching` |
| `/watch-learn/` → `/services/watch-learn/` (+ `/product/watch-learn/`) | Watch & Learn | Detailseite **ohne Inhalt** (nur Titel/Bild + Kommentarformular); Beschreibung nur auf „Mein Service“; Shop-Produkt 449 € | `/coaching/watch-and-learn` |
| `/braut-make-up-coaching/` (+ `/product/braut-make-up-coaching/`) | Braut-Make-up-Coaching | Workshop-Ablauf, FAQ; Produkt „nicht kaufbar“, nur „Jetzt Anfragen“ | `/coaching/braut-make-up-coaching` |
| `/online-coaching/` (+ `/product/online-coaching/`) | Online-Coaching | Zoom-Coaching, FAQ, Formular (mit Telefon); Produkt nur Anfrage | `/coaching/online-coaching` |
| `/ueber-mich/` | Über mich | Vita, Referenzen (VIPs, Meisterschaft, Video/Film, Firmen), Kontaktformular | `/ueber-mich` |
| `/kontaktiere-mich/` | Kontaktiere mich | Adresse, Telefon, E-Mail, Formular | `/kontakt` |
| `/angebotsanfrage/` | Angebotsanfrage | YITH-Shortcode (Anfrage-Warenkorb) | `/kontakt?thema=…` |
| `/shop/`, `/warenkorb/`, `/checkout/`, `/my-account/` | WooCommerce | Shop, Warenkorb, Kasse, Konto | siehe Abschnitt 4 |
| `/privacy-policy/` | Privacy Policy | **Theme-Hersteller-Text (AxiomThemes, Zypern)** – nicht von Jane Hirsch! | entfällt (ersetzt durch `/datenschutz`) |
| `/typography/`, `/evercompare/`, `/luxury-beauty-salon-2` | Theme-/Plugin-Altlasten | keine Inhalte | entfällt |
| Footer-Links | Impressum / Datenschutz | liegen auf **hochzeitsstyling-jane.de** | `/impressum`, `/datenschutz` |

Es gibt keine Blogbeiträge (`/wp-json/wp/v2/posts` → leer).

## 3. Angebote (maßgeblich: „Mein Service“, zuletzt geändert 03.08.2026)

| # | Angebot | Preis lt. Übersicht | Eckdaten |
|---|---|---|---|
| 01 | Einzelcoaching | 899 € zzgl. MwSt., Ratenzahlung in 3 Raten | 1:1, Inhalte individuell, Wochenendtermine möglich |
| 02 | Gruppencoaching | 849 € zzgl. MwSt. p. P., 3 Raten | 2 Tage, max. 5 Personen (Detailseite: „4–6“) |
| 03 | Saloncoaching | 1.200 € / Tag zzgl. MwSt. + ggf. Fahrtkosten | im Salon, ca. 6–7 Std., Material, Puppenköpfe, Zertifikate, Handout inkl.; 2 Raten |
| 04 | Watch & Learn | 449 € / Tag p. P. zzgl. MwSt. + ggf. Fahrtkosten (Salons: Anfrage) | Fortgeschrittene, Trendfrisuren; **keine Detailbeschreibung vorhanden** |
| 05 | Braut-Make-up-Coaching | auf Anfrage | ganztägig, ca. 6–8 Std., Theorie am Vormittag, Praxis am Nachmittag |
| 06 | Online-Coaching | auf Anfrage (individuelles Angebot nach kostenlosem Beratungsgespräch) | Zoom, 1,5–3 Std. je Termin, Aufzeichnung + Workbook |

## 4. Funktionen

| Funktion | Ist-Zustand | Umsetzung im Neubau |
|---|---|---|
| Kontakt-/Anfrageformulare | 6 Formulare (Elementor/CF7): Name, E-Mail, ggf. Telefon, Salonname, Nachricht | **1 zentrales Formular**, serverseitig validiert, mit Themenvorauswahl, Salonname/Telefon optional |
| Kostenloses Erstgespräch | Hinweis „KOSTENLOSES ERSTGESPRÄCH!“, „kostenloses Beratungsgespräch“ | CTA durchgängig, Formular-Thema „Kostenloses Erstgespräch“ |
| Online-Shop (WooCommerce) | 4 Produkte kaufbar (Einzel 899, Gruppe 849, Salon 1.200, Watch & Learn 449), 2 nur per Anfrage; Warenkorb, Kasse, Konto, Germanized, Payments | **Nicht nachgebaut** (Zahlungsanbieter, AGB, Widerrufsbelehrung, Steuerlogik erforderlich) → Buchung per Anfrage. **Entscheidung nötig**, siehe `04-offene-fragen.md` |
| Cookie-Banner | Complianz, unvollständig | Entfällt: keine Cookies, kein Tracking, Schriften selbst gehostet |
| Social-Links | Facebook (Brautstylist Jane Hirsch), Instagram `@jane.hirsch`, TikTok `@janehirsch` | übernommen |
| Telefon-Link | `+49 173 4113111` (ein Link fehlerhaft: `tel:+01734113111`) | korrekt: `+491734113111` |
| Kommentarfunktion | auf Service-CPT-Seiten sichtbar | entfällt |
| Teilnehmer-Stimmen | Karussell mit 5 Nachrichten als Bilder (Profilfoto + Text) | als Text-Karussell mit Profilfotos übernommen; zusätzlich 5,0 ★ (46 Google-Bewertungen, Quelle benannt) |

## 5. Kontaktdaten (aus dem Bestand)

- Jane Hirsch, Kastanienstrasse 6, 28844 Weyhe
- Telefon `+49 173 4113111` (Impressum: `0173/ 411 3111`)
- E-Mail `info@hochzeitsstyling-jane.de` (Footer/Kontakt/Impressum) – Domain hat MX bei All-Inkl (`kasserver.com`). Der Platzhalter `info@website.com` im Off-Canvas-Menü ist Theme-Rest.
- Social: siehe oben

## 6. SEO-Bestand

| URL | Title | Meta-Description |
|---|---|---|
| `/` | Jane Hirsch \| JH Coaching | „Professionelle Make-up Artistin & Stylistin – Über 10 Jahre Erfahrung …“ |
| `/our-services/` | Mein Service \| Jane Hirsch \| Frisur & Make-Up | automatisch aus Seitentext (abgeschnitten) |
| `/ueber-mich/` | Über mich \| Jane Hirsch \| Frisur & Make-Up | automatisch aus Seitentext |
| `/kontaktiere-mich/` | Kontaktiere mich \| Jane Hirsch \| Frisur & Make-Up | Adresse/Telefon |

Mängel: OG-Bild verweist auf Staging-Host `admin6258.live-website.com`, Beschreibungen sind Auto-Auszüge, `og:site_name` doppelt, Twitter-Handle `@jane.hirsch` (vermutlich Instagram-Name), Dublettenpfade (`/watch-learn/` vs. `/services/watch-learn/`), tote Verlinkung (`https://jhttps://jane-hirsch.de/product/watch-learn/`), 404 in der Service-Seite.

## 7. Inhaltliche Unstimmigkeiten im Bestand (nicht eigenmächtig aufgelöst)

1. **Gruppencoaching-Preis**: 849 € (Übersicht, Shop, Detailseite) vs. „899 €“ (FAQ-Frage).
2. **MwSt.-Angabe Gruppencoaching**: „zzgl. MwSt.“ (Übersicht) vs. „inkl. MwSt.“ (Detailseite).
3. **Gruppengröße**: „max. 5“ (Übersicht) vs. „4–6“ (Detailseite).
4. **Raten**: Einzel/Gruppe „3 Raten“ (Übersicht), Gruppen-FAQ „2–3 Raten“, Salon-FAQ „2 Raten“.
5. **Erfahrung**: Meta-Description „Über 10 Jahre“, Vita: Ausbildung 2006 (≈ 20 Jahre); Zähler auf der Startseite leer.
6. **Titel**: „Professionelle Make-up Artist“ im Hero, Positionierung Richtung Brautstyling-Coach – beides vorhanden.
7. **Einzelcoaching-Detailseite**: Preis/Dauer/Ort stehen nicht auf der Detailseite, nur in der Übersicht.

## 8. Bildmaterial & Nutzungsrechte

Auf der Live-Seite liegen Fotos (Hero-Bild mit Braut-Styling `DSC00869`, `IMG_2868`, Ponytail `DSC01745`, Gruppen-/Einzelcoaching-Aufnahmen `Design-ohne-Titel-8/-9`, Café-Foto `unnamed-file`), das Logo (`J.K-1.png`), Service-Banner mit Text (`EINZELCOACHING-*.png`), Theme-Dekor-SVGs und Bewertungs-PNGs.

**Stand 17.10.2026:** Die Auftraggeberseite hat im Chat ausdrücklich freigegeben, die Bilder der alten Seite zu verwenden. Übernommen wurden 6 Fotos (optimiert, siehe `public/images/`) und das Logo (Header). **Nicht** übernommen: Service-Banner mit eingebranntem Text, Theme-Dekor, Stern-Grafiken (Bewertungs-Dekor), Referenz-Thumbnail `IMG_9665` (341 px, zu klein). Offen bleibt der *Nachweis* (Fotograf:in, Einwilligung abgebildeter Personen) – siehe `04-offene-fragen.md` A2.

Zusätzlich hat die Auftraggeberseite am 17.10.2026 ein eigenes Querformat-Foto geliefert (S/W-Doppelbild, 2000×1125, `public/images/duo.jpg`). Es ist jetzt das Hero-Bild der Startseite und das Bildband auf „Über mich“.
