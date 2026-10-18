/**
 * Kurs-Übersicht für Startseite und Coaching-Übersicht („Willkommen zu meinen Coaching & Kursen“).
 * Beschreibungstexte: wörtlich wie vom Auftraggeber am 18.10.2026 für die Startseite geliefert
 * (Quelle: Seite „Mein Service“ der bisherigen Website). Preise und Ratenangaben folgen den
 * bestätigten Werten (Gruppencoaching 899 €, max. 5 Personen, Raten 2–3 nach Absprache).
 */
export type OverviewEntry = {
  /** Preiszeile unter dem Titel */
  priceLine: string;
  /** Untertitel, z. B. „2 Tage / max. 5 Personen“ oder Zielgruppe */
  subtitle?: string;
  text: string;
};

export const overview: Record<string, OverviewEntry> = {
  einzelcoaching: {
    priceLine: "Preis: 899 € zzgl. MwSt. · Ratenzahlung (2–3 Raten) nach Absprache",
    text: "Du arbeitest als Friseurin oder bist angehende Brautstylistin? Du möchtest deine Skills verbessern und du neue Techniken kennen lernen? Du möchtest schneller und effizienter arbeiten können, mehr Umsatz generieren und keine schlaflosen Nächte mehr vor einem Brautstyling haben?",
  },
  gruppencoaching: {
    priceLine: "Preis: 899 € zzgl. MwSt. p. P. · Ratenzahlung (2–3 Raten) nach Absprache",
    subtitle: "2 Tage / max. 5 Personen",
    text: "Du arbeitest als Friseurin oder bist angehende Brautstylistin? Du beherrschst alle Styling Grundlagen, dennoch fehlt die Struktur bei Hochsteckfrisuren? Deine Hinterköpfe fallen schnell zusammen? Deine Locken wollen nicht halten? Deine Brautfrisuren sehen frizzig / unsauber aus?",
  },
  saloncoaching: {
    priceLine: "Preis: 1.200 € / Tag zzgl. MwSt. und eventueller Fahrtkosten",
    text: "Du möchtest deinen Salon auf ein neues Level im Stylingbereich bringen und / oder ihr wollt euch im Brautstyling spezialisieren? Ihr möchtet schneller und effizienter arbeiten können und/oder mehr Umsatz generieren?",
  },
  "watch-and-learn": {
    priceLine: "Preis: 449 € / Tag p. P. zzgl. MwSt. (Salons bitte Anfrage stellen, zur Preiskalkulation) und eventueller Fahrtkosten",
    text: "Du möchtest dein Wissen für neue Trends und Techniken erweitern? Bist schon ein Experte im Frisurenbereich oder zumindest fortgeschritten, so dass du das erlernte gut allein umsetzen kannst, in der Praxis. Dir fehlt nur noch die richtige Technik oder strukturierte Vorgehensweise, sowie der Umgang mit Stylingprodukten für den jeweiligen Aufbau der Trendfrisuren?",
  },
  "braut-make-up-coaching": {
    priceLine: "Preis auf Anfrage",
    subtitle: "Für Friseure, Kosmetiker, Visagisten und Make-up Artisten, die ihr Angebot erweitern und Bräute mit perfekten Make-ups begeistern möchten",
    text: "Möchtest du atemberaubende Braut-Make-ups kreieren, die den ganzen Tag halten und jede Braut zum Strahlen bringen? In meinem intensiven Braut-Make-up-Workshop lernst du, professionelle und langanhaltende Hochzeitslooks zu schminken – von natürlich-elegant bis hin zu glamourös und ausdrucksstark.",
  },
  "online-coaching": {
    priceLine: "Individuelles Angebot nach kostenlosem Beratungsgespräch",
    subtitle: "Für angehende Brautstylistinnen & alle, die ihre Skills auf das nächste Level heben möchten",
    text: "Du träumst davon, Bräute an ihrem schönsten Tag zu begleiten und wünschst dir, deine Styling-Skills weiter auszubauen?",
  },
};
