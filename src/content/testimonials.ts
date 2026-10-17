/**
 * Teilnehmer-Stimmen – Wortlaut aus dem Bereich „Das sagen meine Teilnehmer“ der bisherigen Seite
 * (dort als Bild-Karussell mit Nachrichten-Screenshots). Hier als Text übernommen: Inhalt und Wortwahl
 * unverändert, nur Zeichensetzung und offensichtliche Tippfehler leicht geglättet; Emojis entfallen.
 * Namen nur, wo sie in der Nachricht stehen. Profilfotos stammen aus denselben Bildern.
 *
 * Offen (docs/04-offene-fragen.md, D2): Einverständnis der Teilnehmerinnen für Name/Foto/Zitat
 * schriftlich bestätigen. Neue Stimmen einfach ergänzen; `avatar` = Datei in /public/images/testimonials.
 */
export type Testimonial = { quote: string; author: string; detail?: string; avatar?: string };

export const testimonials: Testimonial[] = [
  {
    quote:
      "Das Coaching mit dir hat mir so viel Spaß gemacht. Ich konnte ganz viel für mich rausholen. Du weißt, dass ich eine Online Academy nutze. Das ist auch toll, jedoch ist für manche Techniken ein Live Coaching unverzichtbar, weil einfach auch Korrekturen nötig sind. Du hast mir mit Ruhe und Geduld geholfen, ein anderes Verständnis für die Haarvorbereitung zu bekommen. Ich war mit unserem Coaching-Tag rundum zufrieden und komme gern wieder zu Dir.",
    author: "Melli",
    detail: "Teilnehmerin Coaching-Tag",
    avatar: "/images/testimonials/melli.jpg",
  },
  {
    quote: "Dieses Seminar war einfach der Hammer, liebe Jane. Ich habe so viel gelernt, jetzt heißt es üben, üben, üben. Vielen lieben Dank nochmal.",
    author: "Teilnehmerin",
    detail: "Seminar",
    avatar: "/images/testimonials/seminar.jpg",
  },
  {
    quote: "Vielen, vielen Dank für die beiden wundervollen Coachingtage. Ich bin sooo glücklich und dankbar für dein Wissen. Einfach großartig.",
    author: "Teilnehmerin",
    detail: "Coachingtage",
    avatar: "/images/testimonials/coaching.jpg",
  },
  {
    quote:
      "Jeder, der noch nicht weiß, ob sich das lohnt, sollte den Gedanken sofort verwerfen: Es lohnt sich nicht nur, es ermöglicht einem ganz neue Horizonte! Ich war beim ersten Seminar dabei und es gibt Techniken, die ich täglich anwende, nicht nur rein fürs Stecken, sondern auch zum normalen Frisieren, und die Kunden sind begeistert von den haltbaren Volumen und Locken. Danke Jane.",
    author: "Teilnehmer:in",
    detail: "Seminar",
    avatar: "/images/testimonials/festival.jpg",
  },
  {
    quote: "Ich wollte mich bei dir bedanken. Ich traue mich immer mehr an die Bräute. Ich weiß, es ist noch nicht perfekt, aber ich gebe nicht auf!",
    author: "Oksana",
    detail: "Studio Weber · Friseur & Tattoo",
    avatar: "/images/testimonials/studio-weber.jpg",
  },
];
