# 05 · Vorlage: Einwilligung für Teilnehmer-Stimmen

> Vorlage, keine Rechtsberatung. Vor dem Versand kurz von der Rechtsprüfung (siehe `04-offene-fragen.md`, A1) gegenlesen lassen.

## Was ist veröffentlicht? (Stand 17.10.2026, aus der alten Seite übernommen)

| # | Name auf der Seite | Foto | Kurzbeschreibung des Zitats |
|---|---|---|---|
| 1 | Melli | Profilfoto | „Das Coaching mit dir hat mir so viel Spaß gemacht …“ |
| 2 | „Teilnehmerin“ (kein Name) | Profilfoto | „Dieses Seminar war einfach der Hammer …“ |
| 3 | „Teilnehmerin“ (kein Name) | Profilfoto | „Vielen, vielen Dank für die beiden wundervollen Coachingtage …“ |
| 4 | „Teilnehmer:in“ (kein Name) | Profilfoto | „Jeder, der noch nicht weiß, ob sich das lohnt …“ |
| 5 | Oksana, Studio Weber · Friseur & Tattoo | Studio-Logo | „Ich wollte mich bei dir bedanken …“ |

Die Texte stehen bereits auf der alten Website. Trotzdem sollte die Einwilligung dokumentiert vorliegen, weil Foto, Name und Zitat personenbezogene Daten sind.

---

## Variante A – Kurznachricht (WhatsApp/Instagram/E-Mail)

> Hallo {Vorname},
>
> deine liebe Nachricht nach dem Coaching hat mich sehr gefreut. 💛 Ich darf sie gern auf meiner neuen Website **jane-hirsch.de** unter „Das sagen meine Teilnehmer“ zeigen – als Zitat, mit deinem **Vornamen** {und deinem **Profilfoto**}.
>
> Das ist freiwillig. Du kannst die Einwilligung jederzeit ohne Begründung per Nachricht widerrufen, dann nehme ich Zitat und Foto von der Seite. Die Website ist öffentlich und weltweit abrufbar; bereits kopierte Inhalte kann ich nicht zurückholen.
>
> **Bist du einverstanden? Bitte antworte kurz mit „Ja, einverstanden“.** Wenn du lieber ohne Foto oder ganz anonym („Teilnehmerin“) erscheinen möchtest, schreib mir das einfach dazu.
>
> Liebe Grüße, Jane

**Aufbewahren:** Antwort als Screenshot oder E-Mail speichern (Datum sichtbar), zusammen mit der Fassung des Zitats, die veröffentlicht wird.

---

## Variante B – Formular zum Unterschreiben

**Einwilligung zur Veröffentlichung von Teilnehmer-Stimmen**

Verantwortliche: Jane Hirsch, Kastanienstrasse 6, 28844 Weyhe, E-Mail: ______________________

Ich willige ein, dass die folgende Nachricht auf **jane-hirsch.de** veröffentlicht wird:

> „______________________________________________________________“

Zusätzlich darf angezeigt werden (Zutreffendes ankreuzen):

- ☐ mein Vorname: ________________
- ☐ mein Beruf/Salon: ________________
- ☐ mein Profilfoto (Datei: ________________)
- ☐ nichts davon – bitte anonym als „Teilnehmerin / Teilnehmer“

**Zweck:** Darstellung der Erfahrungen von Teilnehmenden auf der Website von Jane Hirsch.
**Rechtsgrundlage:** Einwilligung, Art. 6 Abs. 1 lit. a DSGVO.
**Freiwilligkeit und Widerruf:** Die Einwilligung ist freiwillig. Ich kann sie jederzeit ohne Angabe von Gründen mit Wirkung für die Zukunft widerrufen (per E-Mail an die oben genannte Adresse). Danach wird die Veröffentlichung entfernt. Die Rechtmäßigkeit der bis dahin erfolgten Veröffentlichung bleibt unberührt.
**Hinweis:** Die Website ist öffentlich und weltweit abrufbar. Veröffentlichte Inhalte können von Dritten kopiert werden; ich kann diese nicht zurückholen. Ein Widerruf hat keine nachteiligen Folgen für mich.
**Speicherdauer:** Die Veröffentlichung besteht, bis ich widerrufe oder die Stimme nicht mehr gezeigt wird.

Ort, Datum: ________________  Unterschrift: ________________

---

## Nach der Antwort: Seite anpassen

| Antwort | Aktion in `src/content/testimonials.ts` |
|---|---|
| Ja, mit Name und Foto | nichts ändern |
| Ja, aber ohne Foto | `avatar`-Zeile entfernen (es erscheint der Anfangsbuchstabe) |
| Ja, aber anonym | `author: "Teilnehmerin"` setzen, `detail` und `avatar` entfernen |
| Nein / keine Antwort | Eintrag löschen (Foto zusätzlich aus `public/images/testimonials/` entfernen) |

Hinweis zu Nr. 5: Das Bild ist das Logo des Studios, nicht ein Personenfoto – für Name und Studio-Nennung trotzdem Einwilligung einholen.
