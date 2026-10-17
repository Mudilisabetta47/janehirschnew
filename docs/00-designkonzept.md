# 00 · Designkonzept „Atelier Blush & Noir“

## Idee
Die Website von Jane Hirsch soll sich anfühlen wie ein ruhiges Fotostudio kurz vor dem Shooting: viel Raum, große Serifenschrift, ein einziger warmer Akzent. Sie führt Besucherinnen vom Gefühl („Ich will sicher stylen“) über die Angebote zur Anfrage.

## Marken-Ableitung aus dem Bestand
| Bestand | Neubau |
|---|---|
| Schwarzes Handschrift-Monogramm im Kreis | Originallogo im Header (PNG, auf dunklem Hero invertiert); typografische „J.H.“-Wortmarke nur als Ersatz für Bildflächen ohne Foto und im Hero-Siegel. Vektor-Original (SVG) wäre besser |
| Signatur-Schrift „Mrs Saint Delafield“ im Hero | bleibt als sparsames Signatur-Element (Hero-Schriftzug „Coaching“, Siegel, Footer) |
| Schwarz/Weiß + Blush `#FFF4EE`, Creme `#FFF5E2` | `bone #FBF7F2`, `blush #F5E8E0`, `sand #E9D6C8`, Text `ink #181310` |
| Bebas Neue / Roboto (Google-Fonts-Nachladung) | Cormorant Garamond (Display) + Jost (Text), **selbst gehostet** |
| – | Akzent Rosé-Gold `#C9A190` / `#8A5A48` (Text), cinematisches Mokka `#241B17` |

## Bildsprache
- **Bogenfenster (Arch)** als wiederkehrende Form – steht für Spiegel, Tür, „großer Tag“.
- **Galerie-Rahmen** für Fotos: feiner Innenrahmen mit Eckzeichen (`frame-inset`, „atmet“ beim Hover), bei Porträts zusätzlich versetzter Rosé-Linienrahmen und Lichtschein (`FramedImage`), Bögen mit Signatur-Zeile („mit Herz“).
- **Emotion:** Zitat-Band „Meine Mission“ mit Janes eigenen Worten, dezentes Funkeln und wandernder Lichtschein (reine CSS, bei reduzierter Bewegung statisch), riesige Script-Wörter als Hintergrund.
- Feine Linien („Haarsträhnen“) im Hero zeichnen sich beim Laden.
- Rotierendes Textsiegel („Brautstyling · Coaching · Make-up · Hair“).
- Filmkorn als statische Textur auf dunklen Flächen.
- **Fotos der bisherigen Seite** (freigegeben durch Auftraggeber, 17.10.2026) erscheinen im Bogenfenster: Hero, Über mich, Seitenköpfe der Angebote. Zuordnung zentral in `src/content/images.ts`; wird ein Eintrag auf `null` gesetzt, zeigt die Fläche wieder die ruhige Tonwert-Komposition mit „J.H.“-Monogramm.

## Typografie
Display: Cormorant Garamond Light, 56–168 px fluid, enge Laufweite. Eyebrows: Jost, Versalien, 0,26 em Sperrung. Fließtext: Jost 17 px / 1,7.

## Bewegung (sparsam, performant)
- Titel: maskiertes Wort-für-Wort-Reveal (Hero/Seitentitel per **CSS**, ohne Hydration abhängig → bessere LCP).
- Abschnitte: einmaliges Fade-up beim Scrollen (`motion`), gestaffelte Listen.
- Parallax: nur zwei Stellen (Hero-Bogen, Über-mich-Bogen), nur `transform`.
- Hover: Button-Füllung von unten, Linien-Links, Listenzeilen mit Hintergrund- und Pfeil-Bewegung.
- **`prefers-reduced-motion`**: `MotionConfig reducedMotion="user"` + CSS-Fallback (keine Endlosanimation, kein Parallax, kein Smooth-Scroll).
- Kein WebGL/3D: In diesem Kontext ohne gestalterischen Mehrwert, aber mit Performance-Kosten.

## Seitenarchitektur
`/` Start · `/coaching` Übersicht · `/coaching/[angebot]` ×6 · `/ueber-mich` · `/kontakt` · `/impressum` · `/datenschutz`. Jede Angebotsseite folgt demselben Aufbau: Titel → Kurzbeschreibung + Preis → „Auf einen Blick“ (sticky) → Inhalte → FAQ → Anfrage-Formular → weitere Angebote.

## Conversion
Primär-CTA „Kostenloses Erstgespräch“ (Header, Hero, CTA-Band, Formular-Vorauswahl), Sekundär „Coaching entdecken“, Telefon als Tap-Link. Formular mit Themenvorauswahl pro Angebot (`?thema=…`).

## Barrierefreiheit
Kontraste berechnet (siehe `globals.css`), Skip-Link, sichtbarer Fokus, Tastaturbedienung für Menü (Fokusfalle, Esc) und Akkordeon, Formular mit Labels/Fehlertexten/`aria-live`, Zielgrößen ≥ 44 px, Lighthouse Accessibility 100.
