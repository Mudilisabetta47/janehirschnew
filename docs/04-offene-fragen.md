# 04 · Offene Fragen & fehlende Originalinhalte

Priorität: **A** = blockiert die Veröffentlichung · **B** = vor Livegang klären · **C** = Optimierung

## A · Blockierend

| # | Thema | Frage / Aufgabe | Wer |
|---|---|---|---|
| A1 | **Rechtstexte** | Stand 17.10.2026: Impressum und Datenschutz sind *Entwürfe* (sichtbar markiert). Geklärt: Jane hat eine USt-IdNr., Hosting und Mail laufen über **IONOS**, kein Friseur-/Kammerbezug (nur Make-up/Coach). **Noch fehlend:** die USt-IdNr. selbst; Serverstandort und Logfile-Speicherdauer aus dem IONOS-Vertrag; AV-Vertrag mit IONOS; anwaltliche Prüfung des Gesamttexts. Impressum/Datenschutz liegen heute auf *hochzeitsstyling-jane.de* – auf der neuen Seite stehen sie auf der eigenen Domain. | Jane + Rechtsprüfung |
| A2 | **Bildrechte (Nachweis)** | Die Fotos der alten Seite sind übernommen (Freigabe durch Auftraggeber im Chat am 17.10.2026). Vor Livegang bitte absichern: Nennung/Lizenz der Fotograf:innen und Einwilligung der abgebildeten Personen (Models, Teilnehmerinnen – im Gruppenfoto sind Gesichter erkennbar). Bessere Originale (hochauflösend) wären für Hero/Titelbilder ideal. Zuordnung/Austausch: `src/content/images.ts`. | Jane / MEP |
| A3 | **Empfängeradresse & Versand** | Entscheidung: Versand über ein **IONOS-Postfach** (`smtp.ionos.de`, Port 587). Es fehlen: (1) die Absender-/Postfachadresse (z. B. `info@jane-hirsch.de`), (2) Postfach-Passwort – bitte nur direkt in `.env.local` bzw. die Hosting-Umgebung eintragen, nicht im Chat, (3) Bestätigung der Empfängeradresse: aktuell `info@hochzeitsstyling-jane.de` (aus dem Bestand; Domain der *anderen* Website, MX bei All-Inkl) – oder soll es dieselbe IONOS-Adresse sein? Bis dahin läuft das Formular im Trockenlauf. Nach Freigabe: genau eine Testmail. | Jane / MEP |
| A4 | **Online-Checkout (Stripe)** | Entscheidung: voller Online-Checkout. **Umgesetzt** mit eigener Buchungsseite `/buchen/<angebot>` (Vorname, Nachname, Firma, Anschrift, E-Mail, optional Telefon/USt-IdNr./Wunschzeitraum, AGB-Haken, Bestellübersicht) → danach Stripe-Zahlung; dazu `/api/checkout`, Webhook, Buchungsbereich auf Einzel-, Gruppen-, Salon- und Watch-&-Learn-Seite; Braut-Make-up/Online bleiben Anfrage). Er ist **aus**, bis `STRIPE_SECRET_KEY` gesetzt ist; Sichtbarkeit steuert `NEXT_PUBLIC_CHECKOUT_ENABLED`. **Noch nötig – nur Jane/Steuerberatung können das:** (1) Stripe-Konto anlegen und verifizieren, (2) zuerst **Testmodus**: `sk_test_…` in `.env.local`, Webhook auf `https://<domain>/api/stripe/webhook` (Ereignis `checkout.session.completed`, ggf. `…async_payment_succeeded`) mit Signing-Secret, (3) Zahlarten (Karte, SEPA, PayPal …) und Rechnungs-/Steuereinstellungen im Dashboard, (4) Netto/MwSt.-Darstellung und Rechnungsinhalt mit Steuerberatung prüfen, (5) AGB rechtlich fertigstellen (`/agb` ist ein Entwurf mit markierten Lücken), (6) Testkauf mit Stripe-Testkarte, dann Live-Schlüssel. Ratenzahlung (2–3 Raten) bleibt eine Anfrage. | Jane / Steuerberatung |

## B · Vor Livegang klären

| # | Thema | Befund / Frage |
|---|---|---|
| B1 | **Preise & Angaben** | **Geklärt am 17.10.2026:** Gruppencoaching 899 € zzgl. MwSt. pro Person, max. 5 Personen, Ratenzahlung bei allen Angeboten „2–3 Raten nach Absprache“. Umgesetzt auf der Seite. (Online-Shop der alten Seite zeigte 849 € – Preis dort ggf. nicht mehr maßgeblich.) |
| B2 | **Watch & Learn** | Die Detailseite hat im Bestand **keinen Inhalt** (nur Titel/Bild). Im Neubau stehen nur Zielgruppentext und Preis aus „Mein Service“. Bitte Programm, Dauer, Ort, Gruppengröße, FAQ liefern. |
| B3 | **Preise Braut-Make-up & Online** | Bestand: „auf Anfrage“ / individuelles Angebot. So übernommen. |
| B4 | **Erfahrungsangabe** | Meta-Description sagt „Über 10 Jahre Erfahrung“, Vita nennt Ausbildung 2006 (≈ 20 Jahre), Zähler („0+ Kunden“, „0 Jahren“) sind leer. Im Neubau **keine** Zahl erfunden; nur belegte Eckdaten (2006, 2018). Gewünschte Kennzahlen bitte nennen. |
| B5 | **Teilnehmer-Stimmen** | Erledigt: die 5 Stimmen der alten Seite sind übernommen (siehe D2). Weitere Stimmen können in `src/content/testimonials.ts` ergänzt werden. |
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

## D · Bewertungen (neu)
| # | Thema | Frage |
|---|---|---|
| D1 | **5 Sterne / 46 Google-Bewertungen** | Eingebunden laut Screenshot (Profil „Jane Hirsch \| Hochzeitsstyling Bremen“, Stand 17.10.2026). Dieses Profil gehört zum **Hochzeitsstyling**, nicht zu den Coachings – deshalb steht die Quelle dabei. Bitte bestätigen, dass die Anzeige so gewünscht ist, und Zahl regelmäßig aktualisieren (`src/content/rating.ts`). Keine strukturierten Daten (AggregateRating), das ist für selbst eingebundene Bewertungen nicht zulässig. Echte Zitate bitte mit Einverständnis liefern (`src/content/testimonials.ts`). |
| D2 | **Teilnehmer-Stimmen** | Auf der alten Seite lagen 5 Nachrichten als Bilder im Karussell „Das sagen meine Teilnehmer“ (in meiner ersten Analyse fälschlich als Stern-Grafiken eingeordnet – korrigiert). Sie stehen jetzt als Text mit Profilfoto im Karussell (`src/content/testimonials.ts`). Bitte schriftlich bestätigen lassen: Einverständnis der fünf Personen für Zitat, Vorname und Profilfoto (insb. Oksana/Studio Weber, Melli). Wer kein Foto/keinen Namen will: Eintrag ändern oder entfernen. |
