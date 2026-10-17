/**
 * Zentrale Stammdaten. Alle Angaben stammen aus dem Bestand von jane-hirsch.de
 * (Footer, Kontaktseite, Impressum). Nichts hier ist frei erfunden.
 */
export const site = {
  name: "Jane Hirsch",
  brand: "Jane Hirsch · Brautstyling-Coaching",
  jobTitle: "Make-up Artist & Hairstylistin, Coach für Brautstyling",
  tagline: "Professionelle Make-up Artist",
  description:
    "Jane Hirsch – Make-up Artist, Hair- & Brautstylistin und Coach. Einzel-, Gruppen-, Salon- und Online-Coachings für Brautfrisuren und Braut-Make-up. Weyhe bei Bremen.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "de_DE",
  address: {
    street: "Kastanienstrasse 6",
    zip: "28844",
    city: "Weyhe",
    country: "DE",
  },
  phone: { display: "+49 173 4113111", tel: "+491734113111" },
  /** Aus dem Bestand übernommen – muss von Jane Hirsch vor Livebetrieb bestätigt werden. */
  email: "info@hochzeitsstyling-jane.de",
  social: [
    {
      label: "Instagram",
      handle: "@jane.hirsch",
      href: "https://www.instagram.com/jane.hirsch/",
    },
    {
      label: "TikTok",
      handle: "@janehirsch",
      href: "https://www.tiktok.com/@janehirsch",
    },
    {
      label: "Facebook",
      handle: "Brautstylist Jane Hirsch",
      href: "https://www.facebook.com/people/Brautstylist-Jane-Hirsch/100063183432897/",
    },
  ],
} as const;

export const nav = [
  { label: "Coaching", href: "/coaching" },
  { label: "Über mich", href: "/ueber-mich" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

export const legalNav = [
  { label: "Impressum", href: "/impressum" },
  { label: "AGB", href: "/agb" },
  { label: "Datenschutz", href: "/datenschutz" },
] as const;
