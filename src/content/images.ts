/**
 * Bildregister.
 *
 * Die Fotos stammen von der bisherigen Website jane-hirsch.de und wurden von
 * der Auftraggeberseite am 17.10.2026 zur Verwendung freigegeben. Dateien liegen
 * optimiert (JPEG, max. 2000 px) in /public/images; Next.js liefert daraus
 * automatisch AVIF/WebP in passender Größe.
 *
 * Offen (docs/04-offene-fragen.md, A2): Fotograf:innen-Nennung und Einwilligungen
 * der abgebildeten Personen sollten schriftlich vorliegen. Alt-Texte beschreiben
 * nur, was zu sehen ist – keine Personennamen.
 *
 * Eintrag auf `null` setzen → die Fläche zeigt wieder die ruhige Tonwert-Komposition.
 */
export type SiteImage = { src: string; alt: string; width: number; height: number };

export const images = {
  hero: {
    src: "/images/hero.jpg",
    alt: "Braut mit voluminöser Hochsteckfrisur und Perlenohrringen im Profil, eine Hand ordnet die letzten Strähnen",
    width: 1013,
    height: 1800,
  },
  about: {
    src: "/images/about.jpg",
    alt: "Stylistin steckt einer Braut im rosa Tüllkleid die Frisur fest",
    width: 1350,
    height: 1800,
  },
  coaching: {
    src: "/images/coaching.jpg",
    alt: "Lange Wellen mit tief sitzendem Pferdeschwanz und schwarzer Schleife, von hinten",
    width: 1067,
    height: 1800,
  },
  contact: {
    src: "/images/online-coaching.jpg",
    alt: "Lächelnde Frau mit Brille telefoniert am Laptop in einem Café",
    width: 1600,
    height: 1600,
  },
  /** Foto je Angebot (Schlüssel = Slug in services.ts); fehlende Einträge zeigen keine Foto-Fläche. */
  services: {
    einzelcoaching: {
      src: "/images/einzelcoaching.jpg",
      alt: "Stylistin arbeitet an halb hochgesteckten Wellen im Studio",
      width: 2000,
      height: 1125,
    },
    gruppencoaching: {
      src: "/images/gruppencoaching.jpg",
      alt: "Live-Demonstration einer Frisur vor einer Gruppe aufmerksamer Teilnehmerinnen",
      width: 1200,
      height: 1600,
    },
    saloncoaching: {
      src: "/images/gruppencoaching.jpg",
      alt: "Live-Demonstration einer Frisur vor einer Gruppe aufmerksamer Teilnehmerinnen",
      width: 1200,
      height: 1600,
    },
    "watch-and-learn": {
      src: "/images/coaching.jpg",
      alt: "Lange Wellen mit tief sitzendem Pferdeschwanz und schwarzer Schleife, von hinten",
      width: 1067,
      height: 1800,
    },
    "braut-make-up-coaching": {
      src: "/images/about.jpg",
      alt: "Braut im rosa Tüllkleid mit natürlichem Make-up und Hochsteckfrisur",
      width: 1350,
      height: 1800,
    },
    "online-coaching": {
      src: "/images/online-coaching.jpg",
      alt: "Lächelnde Frau mit Brille telefoniert am Laptop in einem Café",
      width: 1600,
      height: 1600,
    },
  } as Record<string, SiteImage>,
} satisfies Record<string, SiteImage | Record<string, SiteImage>>;

export type ImageSlotKey = "hero" | "about" | "coaching" | "contact";
