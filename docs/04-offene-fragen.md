# 04 · Offene Fragen & fehlende Originalinhalte

Priorität: **A** = blockiert die Veröffentlichung · **B** = vor Livegang klären · **C** = Optimierung

## A · Blockierend

| # | Thema | Frage / Aufgabe | Wer |
|---|---|---|---|
| A1 | **Rechtstexte** | Stand 17.10.2026: Impressum und Datenschutz sind *Entwürfe* (sichtbar markiert). Geklärt: Jane hat eine USt-IdNr., Hosting und Mail laufen über **IONOS**, kein Friseur-/Kammerbezug (nur Make-up/Coach). **Noch fehlend:** die USt-IdNr. selbst; Serverstandort und Logfile-Speicherdauer aus dem IONOS-Vertrag; AV-Vertrag mit IONOS; anwaltliche Prüfung des Gesamttexts. Impressum/Datenschutz liegen heute auf *hochzeitsstyling-jane.de* – auf der neuen Seite stehen sie auf der eigenen Domain. | Jane + Rechtsprüfung |
| A2 | **Bildrechte (Nachweis)** | Die Fotos der alten Seite sind übernommen (Freigabe durch Auftraggeber im Chat am 17.10.2026). Vor Livegang bitte absichern: Nennung/Lizenz der Fotograf:innen und Einwilligung der abgebildeten Personen (Models, Teilnehmerinnen – im Gruppenfoto sind Gesichter erkennbar). Bessere Originale (hochauflösend) wären für Hero/Titelbilder ideal. Zuordnung/Austausch: `src/content/images.ts`. | Jane / MEP |
| A3 | **Empfängeradresse & Versand** | Entscheidung: Versand über ein **IONOS-Postfach** (`smtp.ionos.de`, Port 587). Es fehlen: (1) die Absender-/Postfachadresse (z. B. `info@jane-hirsch.de`), (2) Postfach-Passwort – bitte nur direkt in `.env.local` bzw. die Hosting-Umgebung eintragen, nicht im Chat, (3) Bestätigung der Empfängeradresse: aktuell `info@hochzeitsstyling-jane.de` (aus dem Bestand; Domain der *anderen* Website, MX bei All-Inkl) – oder soll es dieselbe IONOS-Adresse sein? Bis dahin läuft das Formular im Trockenlauf. Nach Freigabe: genau eine Testmail. | Jane / MEP |
| A4 | **Online-Shop** | Im Bestand sind 4 Angebote **online kaufbar** (WooCommerce: Einzel 899 €, Gruppe 849 €, Salon 1.200 €, Watch & Learn 449 €), inkl. Warenkorb/Kasse/Konto. Der Neubau ersetzt das durch eine **Buchungsanfrage**. Wurde der Shop je genutzt? Falls Online-Bezahlung gewünscht: Zahlungsanbieter (Stripe/PayPal/Mollie), AGB, Widerrufsbelehrung, Rechnungslogik klären. Es wurden keine Bestellungen/Shop-Daten angetastet. | Jane |

## B · Vor Livegang klären

| # | Thema | Befund / Frage |
|---|---|---|
| B1 | **Widersprüchliche Angaben im Bestand** | (1) Gruppencoaching: 849 € (Übersicht/Shop) vs. „899 €“ in der FAQ; „zzgl. MwSt.“ (Übersicht) vs. „inkl. MwSt.“ (Detailseite). (2) Gruppengröße „max. 5“ vs. „4–6“. (3) Raten: 3 Raten (Übersicht) vs. 2–3 (FAQ) vs. 2 (Saloncoaching). → Im Neubau gelten die Werte der Übersichtsseite „Mein Service“ (zuletzt geändert 03.08.2026); Saloncoaching „2 Raten“ aus der Detailseite. Bitte bestätigen. |
| B2 | **Watch & Learn** | Die Detailseite hat im Bestand **keinen Inhalt** (nur Titel/Bild). Im Neubau stehen nur Zielgruppentext und Preis aus „Mein Service“. Bitte Programm, Dauer, Ort, Gruppengröße, FAQ liefern. |
| B3 | **Preise Braut-Make-up & Online** | Bestand: „auf Anfrage“ / individuelles Angebot. So übernommen. |
| B4 | **Erfahrungsangabe** | Meta-Description sagt „Über 10 Jahre Erfahrung“, Vita nennt Ausbildung 2006 (≈ 20 Jahre), Zähler („0+ Kunden“, „0 Jahren“) sind leer. Im Neubau **keine** Zahl erfunden; nur belegte Eckdaten (2006, 2018). Gewünschte Kennzahlen bitte nennen. |
| B5 | **Teilnehmer-Stimmen** | Bestand: nur Stern-Grafiken ohne Text. Komponente ist fertig (`src/content/testimonials.ts`), zeigt nichts, solange keine echten, freigegebenen Zitate vorliegen. |
| B6 | **Referenzen** | VIP-Namen und Firmenlogos/-namen stammen wörtlich aus „Über mich“. Bitte bestätigen, dass die Nennung weiterhin gewünscht und mit den Genannten abgestimmt ist (Namens-/Markenrechte). |
| B7 | **Logo** | Das Handschrift-Logo ist als PNG (400 px) im Header eingebaut. Für scharfe Darstellung, Favicon und OG-Bild bitte Vektor (SVG/AI) liefern. |
| B8 | **Domain-Setup** | Entscheidung: Hosting bei **IONOS (Node-Paket)**. Zu klären: Ist das aktuelle IONOS-Paket Node-fähig (Deploy Now / Managed Node / VPS) oder braucht es ein anderes Produkt? Umzug mit Redirects (siehe `03-redirects.md`) und Search-Console-Prüfung. Mailboxen der Domain beim Umzug **nicht** anfassen. |
| B9 | **Telefonnummer / WhatsApp / Instagram-DM** | Online-Coaching nennt Anmeldung per E-Mail, WhatsApp oder Instagram. Im Bestand gibt es **keine WhatsApp-Nummer** – gleiche Nummer? Dann Link ergänzen. |
| B10 | **Standort** | Adresse (Weyhe) steht im Impressum. Wird sie öffentlich als Studio-Adresse genannt? Falls ja, Google-Maps-Verknüpfung nur per Link (kein Einbettungs-Tracking). |
| B11 | **Zertifikats-/Qualifikationsaussagen** | „Teilnahmezertifikat“ steht in den FAQ – gibt es eine staatliche Anerkennung? (Wird nicht behauptet.) |

## C · Optimierung nach Abnahme
- Fotos & ggf. kurzes Hero-Video (nur mit Rechten und `poster`, < 3 MB).
- Echte Vorher-/Nachher-Galerie (mit Einwilligungen) statt Instagram-Verweis.
- Redis-Rate-Limit, falls mehrere Server-Instanzen.
- Search-Console-/Backlink-Auswertung für Redirect-Ergänzungen.
- Optional Terminbuchung (z. B. Cal.com selbst gehostet) für das kostenlose Erstgespräch.
- Optional Newsletter (im Bestand existiert ein MailPoet-Seitentyp – Nutzung unklar).
