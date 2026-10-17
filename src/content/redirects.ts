/**
 * Weiterleitungen alter WordPress-URLs → neue URLs (alle permanent, 308/301).
 * Einzige Quelle der Wahrheit: next.config.ts, die Doku (docs/03-redirects.md)
 * und die Apache-Variante (deploy/redirects.htaccess) werden daraus erzeugt
 * (`npm run redirects:export`).
 *
 * `{/}?` erlaubt die alte URL mit und ohne Schrägstrich, damit nur *ein*
 * Sprung entsteht.
 */
export type Redirect = { source: string; destination: string; note?: string };

export const redirects: Redirect[] = [
  { source: "/our-services{/}?", destination: "/coaching", note: "Mein Service" },

  { source: "/einzelcoaching1{/}?", destination: "/coaching/einzelcoaching" },
  { source: "/product/einzelcoaching-2{/}?", destination: "/coaching/einzelcoaching", note: "Shop-Produkt" },

  { source: "/gruppencoaching{/}?", destination: "/coaching/gruppencoaching" },
  { source: "/product/gruppencoaching{/}?", destination: "/coaching/gruppencoaching", note: "Shop-Produkt" },

  { source: "/saloncoaching{/}?", destination: "/coaching/saloncoaching" },
  { source: "/product/saloncoaching{/}?", destination: "/coaching/saloncoaching", note: "Shop-Produkt" },

  { source: "/watch-learn{/}?", destination: "/coaching/watch-and-learn" },
  { source: "/services/watch-learn{/}?", destination: "/coaching/watch-and-learn", note: "Doppelter Pfad im Bestand" },
  { source: "/product/watch-learn{/}?", destination: "/coaching/watch-and-learn", note: "Shop-Produkt" },

  { source: "/braut-make-up-coaching{/}?", destination: "/coaching/braut-make-up-coaching" },
  { source: "/product/braut-make-up-coaching{/}?", destination: "/coaching/braut-make-up-coaching", note: "Shop-Produkt" },

  { source: "/online-coaching{/}?", destination: "/coaching/online-coaching" },
  { source: "/product/online-coaching{/}?", destination: "/coaching/online-coaching", note: "Shop-Produkt" },

  { source: "/kontaktiere-mich{/}?", destination: "/kontakt" },
  { source: "/angebotsanfrage{/}?", destination: "/kontakt", note: "YITH-Anfrage ersetzt durch Kontaktformular" },

  { source: "/privacy-policy{/}?", destination: "/datenschutz", note: "Alter Text stammte vom Theme-Hersteller" },

  // WooCommerce: Warenkorb/Kasse existieren neu unter /kasse; Shop-Übersicht → Angebote
  { source: "/shop{/}?", destination: "/coaching", note: "Shop → Angebotsübersicht" },
  { source: "/warenkorb{/}?", destination: "/kasse", note: "Alter WooCommerce-Warenkorb → neue Kasse" },
  { source: "/checkout{/}?", destination: "/kasse", note: "Alte WooCommerce-Kasse → neue Kasse" },
  { source: "/my-account{/}?", destination: "/coaching", note: "Shop entfällt" },
  { source: "/product/:slug*", destination: "/coaching", note: "Übrige Produkte" },
  { source: "/product-category/:slug*", destination: "/coaching" },

  // Theme-/Plugin-Altlasten ohne Inhalt
  { source: "/typography{/}?", destination: "/" },
  { source: "/evercompare{/}?", destination: "/coaching" },
  { source: "/luxury-beauty-salon-2{/}?", destination: "/" },
  { source: "/services/:slug*", destination: "/coaching", note: "Theme-Custom-Post-Type" },
];
