/**
 * „Über mich“ – Text aus jane-hirsch.de/ueber-mich/ (redaktionell geglättet:
 * Emoji entfernt, Leerzeichen/Interpunktion korrigiert, in Abschnitte gegliedert).
 * Keine inhaltlichen Ergänzungen.
 */
export const about = {
  headline: "Aus Leidenschaft wurde Mission",
  lead: "Schon als Kind hat mich die Beautywelt verzaubert.",
  chapters: [
    {
      title: "Anfang",
      text: [
        "Schon als Kind hat mich die Beautywelt verzaubert. Meine Puppen mussten damals oft als „Versuchsobjekte“ herhalten, und später waren es meine Freundinnen, die ich stundenlang frisiert und geschminkt habe. Für mich war früh klar: Das ist nicht nur ein Hobby – das ist meine Leidenschaft.",
      ],
    },
    {
      title: "Film, TV & Fashion",
      text: [
        "2006 habe ich meine Ausbildung bei Horst Kirchberger in München abgeschlossen und durfte danach als Make-up Artist in die aufregende Welt von Film, TV und Fashion eintauchen. Ich habe viel gelernt, ständig Neues ausprobiert und mein Können bei internationalen Größen wie GHD, Mehtap Karabacak, Babaevski, Kasia Fortuna (London) und Tonya Pushkareva (Russland) vertieft.",
      ],
    },
    {
      title: "Wissen weitergeben",
      text: [
        "Doch dann kam ein Punkt, den viele Stylistinnen kennen: Das Leben verändert sich, und plötzlich passt der Traumberuf nicht mehr so einfach in den Alltag. Durch die Geburt meiner Kinder musste ich neue Wege finden. Ich wollte meine Leidenschaft nicht aufgeben – also habe ich begonnen, mein Wissen weiterzugeben. Erst als Dozentin an einer staatlich anerkannten Schule, später beim Aufbau einer eigenen Make-up-Schule. Und genau da habe ich entdeckt, wie sehr es mich erfüllt, andere zu begleiten.",
      ],
    },
    {
      title: "Brautstyling",
      text: [
        "Immer wieder bin ich auf ein Thema gestoßen: Brautfrisuren. Viele angehende Stylistinnen haben hier die größten Zweifel – „Wie bekomme ich die Frisur haltbar?“, „Wie schaffe ich Volumen?“ oder „Wie style ich so, dass es wirklich professionell aussieht?“ Ich weiß genau, wie sich das anfühlt, wenn man vor einer Braut sitzt und innerlich kämpft, ob es am Ende hält oder perfekt aussieht.",
        "Genau deshalb habe ich mich komplett auf den Bereich Brautstyling spezialisiert. Heute ist es meine Mission, dir die Sicherheit zu geben, die du brauchst – damit du selbstbewusst stylst, auch bei schwierigen Haaren Lösungen findest und deine Bräute begeistert sind.",
      ],
    },
    {
      title: "Mein Coaching",
      text: [
        "Mein Coaching ist nicht nur Technik, sondern auch Erfahrung, die ich dir weitergebe. Damit du nicht jahrelang allein herumprobierst, sondern mit Freude und Leichtigkeit den Weg gehst, den ich damals gesucht habe.",
      ],
    },
  ],
  closing:
    "Wenn du dich gerade in meiner Geschichte wiedererkennst, dann ist mein Coaching genau für dich gemacht. Lass uns gemeinsam dafür sorgen, dass Brautfrisuren für dich kein Problem mehr sind – sondern deine größte Stärke.",
  /** Belegte Eckdaten (nur Aussagen, die im Bestand wörtlich stehen) */
  milestones: [
    { year: "2006", text: "Ausbildung bei Horst Kirchberger in München abgeschlossen" },
    { year: "2018", text: "3. Platz Deutsche Make-up-Meisterschaften" },
    { year: "Heute", text: "Spezialisiert auf Brautstyling und Coaching" },
  ],
  references: [
    {
      title: "VIPs",
      items: [
        "Carsten Maschmeyer",
        "Klaus Strunz",
        "Sarah Kern",
        "Giovanni Zarella",
        "Valerien Ismael",
        "Daniel Golz",
        "Kalle Schwensen",
      ],
    },
    { title: "Meisterschaft", items: ["3. Platz Deutsche Make-up-Meisterschaften 2018"] },
    {
      title: "Video / Film",
      items: [
        "Apollo Hochschule Bremen",
        "Adidas",
        "Reebok",
        "Emsgalerie Rheine",
        "Lookentorpassage Lingen (Ems)",
        "SAT.1",
        "Borgward",
        "Gebrüder Beetz, Berlin – Dokumentationen",
        "CEWE",
      ],
    },
    {
      title: "Firmen",
      items: [
        "Adidas",
        "Hugo Boss",
        "Bonita",
        "Sheego",
        "Mavi",
        "G-Star",
        "Styleboop",
        "Orsay",
        "Reebok",
        "Deichmann",
        "Y-3",
        "About You",
        "Tom Tailor",
        "Lürßen Werft",
        "Bode",
        "Sparkasse",
        "Lookentor Lingen (Ems)",
        "Emslandgalerie Rheine",
        "Aldi",
      ],
    },
  ],
} as const;

/** Zielgruppen laut Bestand – für das Laufband auf der Startseite */
export const audiences = [
  "Friseurinnen",
  "Kosmetiker",
  "Visagisten",
  "Make-up Artists",
  "Angehende Brautstylistinnen",
  "Salon-Teams",
] as const;

/** Die drei Säulen, die in allen Coachings wiederkehren (Theorie · Praxis · Business) */
export const pillars = [
  {
    n: "I",
    title: "Theorie",
    text: "Haar- und Hautvorbereitung, Produkte, Tools, Trends – und wie du Wünsche einer Braut wirklich verstehst.",
  },
  {
    n: "II",
    title: "Praxis",
    text: "Du stylst selbst – am Übungskopf oder Model, unter Anleitung, mit direktem Feedback.",
  },
  {
    n: "III",
    title: "Business",
    text: "Preisgestaltung, Angebotspakete, Kundenakquise und der Ablauf am Hochzeitstag.",
  },
] as const;
