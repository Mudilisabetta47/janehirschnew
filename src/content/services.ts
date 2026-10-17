/**
 * Alle Angebote. Inhalte sind aus jane-hirsch.de übernommen und nur redaktionell
 * aufbereitet (Emojis entfernt, Tippfehler korrigiert, Struktur vereinheitlicht).
 * Preise stammen aus der Seite „Mein Service“ (zuletzt geändert 03.08.2026).
 * Offene Widersprüche im Bestand: docs/04-offene-fragen.md
 */

export type Fact = { label: string; value: string };
export type ContentBlock = { title: string; lead?: string; items: string[] };
export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  number: string;
  title: string;
  /** Kurzer Teaser (Übersicht, Karten) */
  teaser: string;
  /** Zielgruppe in einem Satz (Übersicht) */
  forWhom: string;
  /** Preiszeile für Übersicht / Karten; null = auf Anfrage */
  price: string | null;
  priceNote?: string;
  /** Lange Überschrift der Detailseite */
  headline: string;
  intro: string[];
  /** Typische Probleme der Zielgruppe */
  painPoints?: { title: string; items: string[]; outro?: string };
  blocks: ContentBlock[];
  benefits?: ContentBlock;
  facts: Fact[];
  faq: Faq[];
  /** Vorbelegung des Formulars (siehe lib/contact/topics) */
  topic: string;
  metaTitle: string;
  metaDescription: string;
  /** true, wenn im Bestand keine Detailinhalte existieren */
  contentIncomplete?: boolean;
};

export const services: Service[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "einzelcoaching",
    number: "01",
    title: "Einzelcoaching",
    teaser:
      "1:1-Intensivcoaching für Brautfrisuren – genau auf dein Level und deine Ziele zugeschnitten.",
    forWhom: "Friseurinnen und angehende Brautstylistinnen",
    price: "899 €",
    priceNote: "zzgl. MwSt. · Ratenzahlung in 3 Raten möglich",
    headline: "Brautfrisuren-Intensivcoaching – deine Ausbildung für perfekte Hochzeitsstylings",
    intro: [
      "Möchtest du selbstbewusst und sicher Bräute stylen? In meinem exklusiven Einzelcoaching bekommst du die besten Techniken an die Hand, um atemberaubende Brautfrisuren zu kreieren, die den ganzen Tag perfekt halten.",
      "Du arbeitest als Friseurin oder bist angehende Brautstylistin? Du möchtest deine Skills verbessern und neue Techniken kennenlernen? Du möchtest schneller und effizienter arbeiten, mehr Umsatz generieren und keine schlaflosen Nächte mehr vor einem Brautstyling haben? Dann ist dieses 1:1-Angebot genau das Richtige für dich.",
    ],
    painPoints: {
      title: "Findest du dich hier wieder?",
      items: [
        "Schlaflose Nächte vor einem Brautstyling",
        "Locken fallen nach einiger Zeit wieder raus",
        "Die Proportionen bei Steckfrisuren passen nicht",
        "Die vorderen Partien hängen in dicken Strähnen ohne Halt herunter",
        "Deine Frisuren sehen frizzig und nicht schön strukturiert aus",
        "Dein Toupierhaar fällt immer wieder zusammen oder sieht aus wie ein Vogelnest",
        "Du brauchst für eine Gastfrisur über eine Stunde",
      ],
      outro:
        "Dann ist dieses Training ideal für dich. Es macht dich sicherer, schneller und effizienter. Du kannst die Wünsche deiner Bräute kompetent und professionell umsetzen, fachlich beraten und gehst ohne Unsicherheit in jeden Brauttermin.",
    },
    blocks: [
      {
        title: "Schritt 1 · Die Basis für perfekte Brautfrisuren",
        items: [
          "Die richtige Haaranalyse und Haarvorbereitung für langanhaltende Stylings",
          "Wichtige Werkzeuge, Produkte und Materialien für Profi-Ergebnisse",
          "Beratung und Kommunikation: wie du die Wünsche der Braut perfekt umsetzt",
        ],
      },
      {
        title: "Schritt 2 · Praxis – du stylst selbst unter Anleitung",
        items: [
          "Hochsteck-, Flecht- und Trendfrisuren für verschiedene Brautlooks",
          "Arbeiten mit Volumen: Techniken für füllige und langlebige Stylings",
          "Integrieren von Haarschmuck, Schleier und Extensions",
          "Fixierungstechniken für wetter- und tanzfeste Frisuren",
        ],
      },
      {
        title: "Schritt 3 · Business & Marketing – so gewinnst du Bräute als Kundinnen",
        items: [
          "Wie du dich als Brautstylistin erfolgreich vermarktest",
          "Preisgestaltung und Angebotspakete für dein Styling-Business",
          "Tipps für den Umgang mit Bräuten und Hochzeitsdienstleistern",
        ],
      },
    ],
    facts: [
      { label: "Format", value: "1:1-Coaching" },
      { label: "Preis", value: "899 € zzgl. MwSt." },
      { label: "Zahlung", value: "Ratenzahlung in 3 Raten möglich" },
      { label: "Termine", value: "Auch am Wochenende möglich" },
      { label: "Inhalte", value: "Individuell anpassbar" },
    ],
    faq: [
      {
        q: "Ich habe noch keine Erfahrung mit Brautfrisuren. Ist dein Coaching trotzdem für mich geeignet?",
        a: "Du solltest wissen, was ein Lockenstab und ein Glätteisen ist. Weitere Kenntnisse sind für ein Einzelcoaching nicht erforderlich, da wir es individuell auf deine Bedürfnisse anpassen können.",
      },
      {
        q: "Was genau werde ich im Coaching lernen?",
        a: "Die Inhalte besprechen wir gern vorab in einem Telefonat oder Videocall und passen sie deinen Bedürfnissen an.",
      },
      {
        q: "Wie läuft der praktische Teil ab?",
        a: "Du kannst das Gelernte am Puppenkopf oder am Model umsetzen. Findet das Coaching bei mir im Studio statt, stelle ich dir beides zur Verfügung.",
      },
      {
        q: "Welche Brautfrisuren werden wir durchgehen?",
        a: "In einem vorherigen Telefonat oder Videocall besprechen wir die Themen, die für dich relevant und wichtig sind. Danach stelle ich ein passendes Programm für dein Einzelcoaching zusammen.",
      },
      {
        q: "Wie flexibel sind die Termine?",
        a: "Ich biete auch Termine an den Wochenenden an.",
      },
      {
        q: "Welche Produkte und Werkzeuge brauche ich?",
        a: "Vorab bekommst du von mir eine Liste. Produkte werden beim Coaching alle gestellt. Du musst nur einige Tools mitbringen, zum Beispiel Föhn, Lockenstab und Glätteisen. Hast du etwas davon nicht zur Hand, kannst du es am Tag des Coachings bei mir ausprobieren.",
      },
      {
        q: "Bekomme ich nach dem Coaching etwas zum Nachschlagen?",
        a: "Während des Einzelcoachings kannst du alles mit dem Handy mitfilmen, um die Abläufe später zu Hause noch einmal anzuschauen. Zusätzlich bekommst du per E-Mail ein PDF-Handout mit allen Produkten (Eigenschaften und Verwendung) sowie allen Frisuren des Coachings als Schritt-für-Schritt-Anleitung.",
      },
    ],
    topic: "einzelcoaching",
    metaTitle: "Einzelcoaching Brautfrisuren – 1:1-Intensivcoaching",
    metaDescription:
      "Brautfrisuren-Intensivcoaching 1:1: Haarvorbereitung, Hochsteck- und Flechtfrisuren, Fixierung und Business-Know-how. 899 € zzgl. MwSt., Ratenzahlung möglich.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "gruppencoaching",
    number: "02",
    title: "Gruppencoaching",
    teaser:
      "Zwei Tage Intensivtraining in kleiner Gruppe – Hochsteck- und Flechtfrisuren, die den ganzen Tag halten.",
    forWhom: "Friseurinnen, Kosmetiker, Visagisten, Make-up Artists",
    price: "849 €",
    priceNote: "zzgl. MwSt. pro Person · Ratenzahlung in 3 Raten möglich",
    headline: "Gruppencoaching: Brautfrisuren meistern – werde zur Expertin für Hochzeitsstylings",
    intro: [
      "In meinem intensiven Gruppencoaching zeige ich dir die besten Techniken für professionelle Hochsteck- und Flechtfrisuren, den perfekten Einsatz von Haarschmuck und vieles mehr.",
      "Dieses Training richtet sich an Friseure, Kosmetiker, Visagisten und Make-up Artisten, die in die Welt des Brautstylings einsteigen oder ihre Technik perfektionieren möchten. Gemeinsam in einer kleinen Gruppe lernst du praxisnah, wie du Bräute an ihrem großen Tag perfekt stylst.",
    ],
    painPoints: {
      title: "Kommt dir das bekannt vor?",
      items: [
        "Du beherrschst alle Styling-Grundlagen, dennoch fehlt die Struktur bei Hochsteckfrisuren",
        "Deine Hinterköpfe fallen schnell zusammen",
        "Deine Locken wollen nicht halten",
        "Deine Brautfrisuren sehen frizzig oder unsauber aus",
      ],
    },
    blocks: [
      {
        title: "Theorie · Die Grundlagen des Brautstylings",
        items: [
          "Aktuelle Trends und klassische Brautfrisuren: welche Looks Bräute lieben",
          "Die richtige Vorbereitung der Haare für langanhaltende Stylings",
          "Produktempfehlungen und Tool-Guide: was du wirklich brauchst",
          "Kundenkommunikation und Beratung: die perfekte Frisur für jede Braut finden",
        ],
      },
      {
        title: "Praxis · Hands-on-Training mit Modell oder Übungskopf",
        items: [
          "Erarbeiten verschiedener Brautfrisuren (z. B. romantisch, elegant, boho, sleek) – Steck- und Flechttechniken, die für Volumen und Stabilität sorgen",
          "Haarschmuck, Schleier und Extensions richtig platzieren und befestigen",
          "Fixierung und Haltbarkeitstechniken, damit die Frisur den ganzen Tag hält",
        ],
      },
      {
        title: "Business & Marketing · Dein Erfolg als Brautstylistin",
        items: [
          "Preisgestaltung und Angebotspakete für Bräute",
          "Kundenakquise: wie du Bräute auf dich aufmerksam machst",
          "Professionelles Arbeiten: Tipps für den Ablauf am Hochzeitstag",
        ],
      },
    ],
    benefits: {
      title: "Deine Vorteile im Gruppencoaching",
      items: [
        "Praxisnah und interaktiv: du übst selbst mit direkter Anleitung",
        "Austausch mit Gleichgesinnten: lerne mit und von anderen Teilnehmerinnen",
        "Individuelles Feedback und persönliche Tipps für deine Weiterentwicklung",
        "Sofort anwendbare Techniken für dein Styling-Business",
      ],
    },
    facts: [
      { label: "Dauer", value: "2 Tage Intensivtraining" },
      { label: "Gruppe", value: "Kleine Gruppe, max. 5 Personen" },
      { label: "Preis", value: "849 € zzgl. MwSt. pro Person" },
      { label: "Zahlung", value: "Ratenzahlung in 3 Raten möglich" },
      { label: "Ort", value: "Nach Absprache" },
      { label: "Termine", value: "Feste Termine oder auf Anfrage" },
      { label: "Inklusive", value: "Zertifikat und Handout" },
    ],
    faq: [
      {
        q: "Wie lange dauert das Coaching? Ein oder zwei Tage?",
        a: "Ein Gruppencoaching dauert 2 Tage.",
      },
      {
        q: "Wie viele Teilnehmerinnen sind in einer Gruppe? Wird individuell auf mich eingegangen?",
        a: "Die Gruppen sind klein gehalten, damit die Betreuung in der Praxis gut möglich ist.",
      },
      {
        q: "Muss ich ein Modell oder einen Übungskopf mitbringen?",
        a: "Möchtest du die Techniken erst an einem Übungskopf probieren, wird dir dieser zur Verfügung gestellt. Wenn du gleich an einem Model üben möchtest, musst du dir dieses selbst organisieren. Gerne unterstütze ich dich dabei.",
      },
      {
        q: "Welche Materialien und Tools werden benötigt?",
        a: "Alle Produktmaterialien sowie Puppenköpfe werden gestellt. Tools wie Föhn, Lockenstab, Glätteisen und Kreppeisen musst du mitbringen. Hast du eines davon nicht zur Hand, kann ich eventuell aushelfen – besprich das gern vorab mit mir.",
      },
      {
        q: "Wo findet das Coaching statt?",
        a: "Nach Absprache in einem Studio oder Salon in deiner Nähe.",
      },
      {
        q: "Sind im Preis alle Kosten enthalten?",
        a: "Im Preis sind alle Kosten inklusive Materialien enthalten.",
      },
      {
        q: "Gibt es eine Ratenzahlung?",
        a: "Ja, du kannst in Raten zahlen. Schreib mir dazu gern eine Nachricht.",
      },
      {
        q: "Erhalte ich nach dem Coaching ein Zertifikat?",
        a: "Ja, jede Teilnehmerin und jeder Teilnehmer erhält nach dem Coaching ein Zertifikat.",
      },
      {
        q: "Gibt es Unterlagen mit den wichtigsten Techniken?",
        a: "Jede Teilnehmerin erhält nach dem Coaching ein PDF-Handout, in dem alle Produkte mit Eigenschaften und Verwendung aufgeführt sind, dazu alle Frisuren des Coachings als Schritt-für-Schritt-Anleitung zum Nacharbeiten zu Hause.",
      },
      {
        q: "Bekomme ich nach dem Coaching weiterhin Unterstützung?",
        a: "Natürlich bin ich auch nach dem Coaching für euch da, wenn ihr Fragen zu den Themen des Gruppencoachings habt.",
      },
      {
        q: "Kann ich nach dem Coaching direkt mit dem Brautstyling starten?",
        a: "Wie nach jeder Weiterbildung musst du das Erlernte üben, bis es zu 100 % sitzt. Du wirst aber mehr Sicherheit und Wissen haben, um die Wünsche deiner Bräute besser und sicherer umzusetzen.",
      },
      {
        q: "Was unterscheidet dein Coaching von anderen Brautstyling-Kursen?",
        a: "In meinem Coaching für Brautfrisuren gehen wir richtig in die Tiefe, denn hier fehlt meistens das Wissen. Basis, Vorbereitung und systematischer Aufbau sind die wichtigsten Dinge bei einer Brautfrisur, damit sie den ganzen Tag hält. Das gehen wir ganz genau durch.",
      },
      {
        q: "Gibt es Beispiele von Frisuren, die Teilnehmerinnen erstellt haben?",
        a: "Schau gern auf meinem Instagram-Profil @jane.hirsch in die Highlights „BBC 1–4“. Dort findest du Ergebnisse meiner letzten Teilnehmerinnen und einen ersten Eindruck von meinen Seminaren.",
      },
      {
        q: "Kann ich nach dem Gruppencoaching ein Einzelcoaching buchen?",
        a: "Selbstverständlich. Ich empfehle, nach einem Gruppencoaching erst das Erlernte zu üben, damit du merkst, wo du noch Bedarf hast.",
      },
    ],
    topic: "gruppencoaching",
    metaTitle: "Gruppencoaching Brautfrisuren – 2 Tage in kleiner Gruppe",
    metaDescription:
      "Zwei Tage Intensivtraining für Brautfrisuren in kleiner Gruppe: Theorie, Praxis und Business. 849 € zzgl. MwSt. pro Person, inklusive Zertifikat und Handout.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "saloncoaching",
    number: "03",
    title: "Saloncoaching",
    teaser:
      "Dein Team wird fit für Hochzeitsstylings – ich komme direkt zu euch in den Salon.",
    forWhom: "Salons und Teams, die sich im Brautstyling spezialisieren",
    price: "1.200 € / Tag",
    priceNote: "zzgl. MwSt. und eventueller Fahrtkosten",
    headline: "Saloncoaching für Brautfrisuren – dein Team fit für Hochzeitsstylings",
    intro: [
      "Du möchtest deinen Salon auf ein neues Level im Stylingbereich bringen und/oder ihr wollt euch im Brautstyling spezialisieren? Ihr möchtet schneller und effizienter arbeiten und/oder mehr Umsatz generieren? Dann ist dieses Angebot für dich und dein Team richtig.",
      "Mit meinem individuellen Saloncoaching für Brautfrisuren schule ich dich und dein Team direkt in eurem Salon. Ihr erlernt praxisnahe Techniken, um Bräute perfekt zu stylen und euer Angebot im Hochzeitsbereich auszubauen. Das Coaching richtet sich an Friseure, Kosmetiker, Visagisten und Make-up Artisten, die mit dem Brautstyling starten oder ihre bestehenden Fähigkeiten optimieren möchten.",
    ],
    blocks: [
      {
        title: "Theorie · Die perfekte Basis für euer Brautstyling-Angebot",
        items: [
          "Die wichtigsten Brautfrisuren-Trends und -Techniken",
          "Richtige Haarvorbereitung für langanhaltende Stylings",
          "Produkte, Tools und Materialien – was ihr wirklich braucht",
          "Kundenberatung: wie ihr die Wünsche der Braut optimal umsetzt",
        ],
      },
      {
        title: "Praxis · Hands-on-Training für dein Team",
        items: [
          "Steck- und Flechttechniken: lockere, elegante und romantische Stylings",
          "Volumenaufbau: Toupiertechniken, Locken und Wellen für mehr Fülle",
          "Schleier und Haarschmuck richtig platzieren und befestigen",
          "Haltbarkeit und Fixierung: so bleibt die Frisur den ganzen Tag perfekt",
          "Individuelles Arbeiten an Modellen oder Übungsköpfen",
        ],
      },
      {
        title: "Business & Marketing für Salons",
        items: [
          "Wie ihr Brautstylings erfolgreich in euer Angebot integriert",
          "Preisgestaltung und Paketangebote für Bräute",
          "Kundenkommunikation und Terminmanagement für Hochzeiten",
          "Kooperationen mit Make-up Artisten und Hochzeitsdienstleistern",
        ],
      },
    ],
    benefits: {
      title: "Dein Ziel",
      items: [
        "Nach dem Coaching ist dein Team bestens vorbereitet, Bräute professionell zu stylen und euren Salon als Hochzeitsstyling-Experten zu positionieren. Alle Themen sind nach euren Wünschen und Bedürfnissen anpassbar.",
      ],
    },
    facts: [
      { label: "Ort", value: "Direkt in eurem Salon – ich komme zu euch" },
      { label: "Dauer", value: "1 Tag, ca. 6–7 Stunden inkl. Pause" },
      { label: "Teilnehmer", value: "Je nach Teamgröße und Wunschthemen" },
      { label: "Preis", value: "1.200 € pro Tag zzgl. MwSt. und eventueller Fahrtkosten" },
      {
        label: "Inklusive",
        value: "Produkte, Puppenköpfe (hochwertige Köpfe der Firma Limage), Zertifikate und Handout",
      },
      { label: "Zahlung", value: "In 2 Raten möglich" },
      { label: "Termin", value: "Flexibel nach Absprache" },
    ],
    faq: [
      { q: "Wo findet das Coaching statt?", a: "Das Saloncoaching findet bei dir im Salon vor Ort statt." },
      { q: "Wie lange dauert das Coaching?", a: "Für ein Saloncoaching plane ich 6–7 Stunden ein, inklusive Pause." },
      {
        q: "Bietest du nach dem Coaching Support oder Nachbetreuung an?",
        a: "Gern könnt ihr mich auch nach dem Coaching anschreiben, falls ihr bei dem Erlernten Probleme habt.",
      },
      {
        q: "Gibt es ein Zertifikat nach Abschluss?",
        a: "Nach Abschluss des Saloncoachings bekommt jede Teilnehmerin und jeder Teilnehmer ein Zertifikat.",
      },
      {
        q: "Arbeite ich direkt an Modellen oder an einem Übungskopf?",
        a: "Wenn ihr die Techniken erst an einem Puppenkopf üben möchtet, stelle ich hochwertige Puppenköpfe der Firma Limage zur Verfügung. Möchtest du an einem Model üben, musst du dir ein eigenes Model organisieren.",
      },
      {
        q: "Welche Brautfrisuren lerne ich? Gibt es feste Looks oder kann ich Wünsche äußern?",
        a: "Gern erstelle ich ein Programm individuell nach euren Wünschen und Bedürfnissen, damit ihr gut für den Salonalltag vorbereitet seid.",
      },
      {
        q: "Sind Materialkosten im Preis enthalten?",
        a: "Alle Materialien sowie die Puppenköpfe sind im Preis enthalten.",
      },
      { q: "Kann ich in Raten zahlen?", a: "Ja, du kannst in 2 Raten zahlen." },
      {
        q: "Kann ich das Coaching für mein gesamtes Team buchen?",
        a: "Natürlich. Nach Absprache muss ich eventuell eine Assistenz dazubuchen, damit ihr in der Praxis alle gut betreut seid.",
      },
      {
        q: "Bietest du auch Online-Coachings an oder nur Schulungen vor Ort?",
        a: "Online-Coaching biete ich über Zoom an – so kannst du von überall aus teilnehmen.",
      },
    ],
    topic: "saloncoaching",
    metaTitle: "Saloncoaching Brautstyling – Schulung direkt im Salon",
    metaDescription:
      "Brautfrisuren-Schulung für dein Salon-Team, direkt bei euch vor Ort: 1 Tag, 1.200 € zzgl. MwSt., inklusive Material, Puppenköpfen, Zertifikaten und Handout.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "watch-and-learn",
    number: "04",
    title: "Watch & Learn",
    teaser:
      "Neue Trends und Techniken für Fortgeschrittene – strukturierte Vorgehensweise und Umgang mit Stylingprodukten.",
    forWhom: "Fortgeschrittene und Profis im Frisurenbereich",
    price: "449 € / Tag p. P.",
    priceNote: "zzgl. MwSt. und eventueller Fahrtkosten · Salons bitte anfragen",
    headline: "Watch & Learn – Trendfrisuren strukturiert aufbauen",
    intro: [
      "Du möchtest dein Wissen für neue Trends und Techniken erweitern? Du bist schon Expertin oder Experte im Frisurenbereich oder zumindest fortgeschritten, sodass du das Erlernte in der Praxis gut allein umsetzen kannst?",
      "Dir fehlt nur noch die richtige Technik oder strukturierte Vorgehensweise sowie der Umgang mit Stylingprodukten für den jeweiligen Aufbau der Trendfrisuren? Dann ist Watch & Learn das passende Format für dich.",
    ],
    blocks: [],
    facts: [
      { label: "Preis", value: "449 € pro Tag und Person zzgl. MwSt." },
      { label: "Zusatzkosten", value: "Eventuelle Fahrtkosten" },
      { label: "Für Salons", value: "Bitte Anfrage stellen – die Preiskalkulation erfolgt individuell" },
    ],
    faq: [],
    topic: "watch-and-learn",
    metaTitle: "Watch & Learn – Trendfrisuren für Fortgeschrittene",
    metaDescription:
      "Watch & Learn: Techniken, strukturierte Vorgehensweise und Produktkenntnis für Trendfrisuren. 449 € pro Tag und Person zzgl. MwSt.",
    contentIncomplete: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "braut-make-up-coaching",
    number: "05",
    title: "Braut-Make-up-Coaching",
    teaser:
      "Ganztägiger Workshop für langanhaltende Braut-Make-ups – von natürlich-elegant bis glamourös.",
    forWhom: "Friseure, Kosmetiker, Visagisten und Make-up Artists",
    price: null,
    priceNote: "Preis auf Anfrage",
    headline: "Braut-Make-up-Workshop – professionelle, langanhaltende Hochzeitslooks",
    intro: [
      "Möchtest du atemberaubende Braut-Make-ups kreieren, die den ganzen Tag halten und jede Braut zum Strahlen bringen? In meinem intensiven Braut-Make-up-Workshop lernst du, professionelle und langanhaltende Hochzeitslooks zu schminken – von natürlich-elegant bis hin zu glamourös und ausdrucksstark.",
      "Dieses Coaching richtet sich an Friseure, Kosmetiker, Visagisten und Make-up Artisten, die ihr Angebot erweitern und Bräute mit perfekten Make-ups begeistern möchten.",
    ],
    blocks: [
      {
        title: "Vormittag · Theorie & Demonstration – Schritt 1: die perfekte Basis",
        lead: "Zuerst vermittle ich dir die wichtigsten Grundlagen für ein professionelles Braut-Make-up. Ich demonstriere an einem Modell verschiedene Looks und erkläre dir jeden Schritt genau.",
        items: [
          "Hautvorbereitung: Pflege, Primer und Produkte für verschiedene Hauttypen",
          "Foundation-Techniken für ein makelloses, langanhaltendes Finish",
          "Farb- und Typberatung: so wählst du die perfekten Töne für jede Braut",
          "Concealing & Contouring: Gesichtszüge optimal hervorheben",
        ],
      },
      {
        title: "Schritt 2 · Verschiedene Braut-Make-up-Looks & Spezialtechniken",
        items: [
          "Der natürliche Look: frisch, strahlend und zeitlos",
          "Glamouröses Braut-Make-up: ausdrucksstark mit intensiven Augen und Lippen",
          "Make-up für Schlupflider: Techniken für eine offene und wache Augenpartie",
          "Best-Ager-Make-up: sanfte Frische und jugendliche Strahlkraft für Bräute 40+",
        ],
      },
      {
        title: "Schritt 3 · Produkte, Tools & Fixierungstechniken",
        items: [
          "Welche Produkte sind für ein Braut-Make-up essenziell?",
          "Wasser- und Tränenfestigkeit: Fixierung, die den ganzen Tag hält",
          "Arbeiten mit Highlighter und Blush für den perfekten Glow",
        ],
      },
      {
        title: "Nachmittag · Praxis – du setzt das Gelernte um",
        lead: "Jetzt wird es praktisch: Du arbeitest selbst an einem Modell oder Übungskopf und setzt die erlernten Techniken direkt um.",
        items: [
          "Umsetzung verschiedener Make-up-Looks mit individueller Betreuung",
          "Arbeiten mit Licht und Schatten für ein perfektes Finish",
          "Verbesserung deiner Technik durch gezieltes Feedback",
          "Tipps zur Effizienz: schnelles und professionelles Arbeiten am Hochzeitstag",
        ],
      },
    ],
    benefits: {
      title: "Dein Nutzen",
      items: [
        "Du lernst verschiedene Braut-Make-up-Looks für unterschiedliche Kundentypen.",
        "Du bekommst Sicherheit bei der Wahl der richtigen Produkte und Techniken.",
        "Du erlernst professionelle Fixierungsmethoden für langanhaltende Ergebnisse.",
        "Du kannst dein Portfolio erweitern und mehr Bräute als Kundinnen gewinnen.",
        "Du erhältst individuelles Feedback und wertvolle Tipps für dein Business.",
      ],
    },
    facts: [
      { label: "Dauer", value: "Ganztägiger Workshop, ca. 6–8 Stunden" },
      { label: "Ort", value: "Nach Absprache (Studio oder externe Location)" },
      { label: "Modelle", value: "Eigene Modelle oder nach Absprache gestellt" },
      { label: "Termine", value: "Flexible Buchung möglich" },
      { label: "Preis", value: "Auf Anfrage" },
    ],
    faq: [
      {
        q: "Ist das Coaching für mich geeignet, auch wenn ich bisher nur wenig Erfahrung mit Make-up habe?",
        a: "Das Coaching kann individuell gestaltet werden und ist somit für Einsteigerinnen wie für fortgeschrittene Stylistinnen geeignet.",
      },
      {
        q: "Erhalte ich nach dem Coaching ein Teilnahmezertifikat?",
        a: "Jede Teilnehmerin und jeder Teilnehmer erhält nach dem Coaching ein Zertifikat.",
      },
      {
        q: "Kann ich das Gelernte direkt selbst ausprobieren?",
        a: "Nach dem theoretischen Teil setzt du das Gelernte im praktischen Teil um.",
      },
      {
        q: "Muss ich eigene Pinsel, Foundations und Paletten mitbringen?",
        a: "Zum Coaching musst du nur ein kleines Pinselset mitbringen, alle anderen Materialien werden gestellt.",
      },
      {
        q: "Lernen wir auch, welche Tools die Arbeit erleichtern?",
        a: "Ja, ich zeige dir alle Tipps und Tricks zur Anwendung der Tools, die man für ein Make-up benötigt, sodass du sie sofort in der Praxis umsetzen kannst.",
      },
      {
        q: "Wie viel kann ich als Brautstylistin für ein Make-up verlangen?",
        a: "Businessthemen wie Preisgestaltung und der Aufbau eines Netzwerks sind ein wichtiger Teil des Coachings.",
      },
      {
        q: "Gibt es Tipps für professionelle Fotos meiner Arbeiten?",
        a: "Fotografie und Portfolioaufbau sind ebenfalls im Coaching enthalten.",
      },
      {
        q: "Brauche ich ein Modell zum Üben?",
        a: "Für den Praxisteil wird ein Modell benötigt. Du kannst gern selbst eines mitbringen, oder wir unterstützen dich dabei.",
      },
      {
        q: "Kann ich nach dem Coaching weiterführende Trainings oder Masterclasses buchen?",
        a: "Selbstverständlich kannst du nach einem Coaching weitere Workshops oder Coachings buchen, um deine Skills weiterzuentwickeln.",
      },
    ],
    topic: "braut-make-up-coaching",
    metaTitle: "Braut-Make-up-Coaching – ganztägiger Workshop",
    metaDescription:
      "Braut-Make-up-Workshop: natürliche und glamouröse Looks, Schlupflider, Best Ager, Fixierung. Theorie am Vormittag, Praxis am Nachmittag, ca. 6–8 Stunden.",
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "online-coaching",
    number: "06",
    title: "Online-Coaching",
    teaser:
      "Brautfrisuren, Braut-Make-up oder Handy-Fotografie für Content – live per Zoom, von überall.",
    forWhom: "Angehende Brautstylistinnen und alle, die ihre Skills auf das nächste Level heben möchten",
    price: null,
    priceNote: "Individuelles Angebot nach kostenlosem Beratungsgespräch",
    headline: "Onlinecoaching Brautstyling – von der Unsicherheit zur sicheren Hand",
    intro: [
      "Meine Onlinecoachings finden bequem via Zoom statt. Egal, ob du deine Skills in Brautfrisuren, Brautmake-up oder sogar in der Fotografie mit dem Handy für perfekte Content-Erstellung verbessern möchtest – hier bekommst du praxisnahes Wissen, direkt von mir erklärt und Schritt für Schritt gezeigt. So kannst du von überall aus lernen, deine Fragen stellen und sofort in die Umsetzung gehen.",
      "Du träumst davon, Bräute an ihrem schönsten Tag zu begleiten und wünschst dir, deine Styling-Skills weiter auszubauen? Als erfahrene Brautstylistin unterstütze ich dich dabei, dein Potenzial voll zu entfalten – egal, ob du gerade erst startest oder schon erste Erfahrungen hast und deine Techniken perfektionieren möchtest.",
    ],
    blocks: [
      {
        title: "Was dich erwartet",
        items: [
          "Individuelle 1:1-Betreuung – wir analysieren gemeinsam deine aktuellen Kenntnisse und arbeiten gezielt an deinen persönlichen Zielen",
          "Technik- und Look-Trainings – ob romantische Flechtfrisuren, elegante Hochsteckfrisuren oder typgerechtes Braut-Make-up",
          "Live-Demos und Schritt-für-Schritt-Anleitungen, die du sofort nachmachen kannst",
          "Tipps für den Umgang mit Bräuten, Preisgestaltung und Aufbau deiner Marke",
          "Fragerunden, damit keine Unsicherheit bleibt",
          "Aufzeichnung der Session, damit du alles jederzeit wiederholen kannst",
        ],
      },
      {
        title: "So läuft’s ab",
        items: [
          "Das Coaching findet online via Zoom statt (oder auf Wunsch über ein anderes Tool).",
          "Dauer und Inhalte stimmen wir individuell auf dich ab.",
          "Nach unserem Termin erhältst du ein persönliches Workbook mit Tipps und Übungen.",
        ],
      },
    ],
    benefits: {
      title: "Dein Mehrwert",
      items: [
        "Mehr Selbstsicherheit und Routine bei Brautstylings",
        "Techniken, die dich von anderen Stylistinnen abheben",
        "Unterstützung beim Aufbau deines Business als Brautstylistin",
      ],
    },
    facts: [
      { label: "Ort", value: "Online via Zoom" },
      { label: "Dauer", value: "In der Regel 1,5 bis 3 Stunden pro Termin, mehrere Termine möglich" },
      { label: "Termine", value: "Flexible Buchung möglich" },
      { label: "Preis", value: "Individuelles Angebot nach kostenlosem Beratungsgespräch" },
      { label: "Danach", value: "Aufzeichnung der Session und persönliches Workbook" },
    ],
    faq: [
      {
        q: "Für wen ist das Coaching geeignet?",
        a: "Mein Onlinecoaching richtet sich an alle, die (professionell) Brautstylings erlernen oder ihre vorhandenen Fähigkeiten verbessern möchten – egal ob du gerade startest, schon erste Kundinnen hattest oder dir mehr Sicherheit und neue Techniken wünschst.",
      },
      {
        q: "Muss ich Vorkenntnisse haben?",
        a: "Nein. Ich hole dich genau dort ab, wo du gerade stehst. Wir passen die Inhalte individuell an dein Level an – vom Anfänger bis zur ambitionierten Stylistin, die ihr Portfolio erweitern möchte.",
      },
      {
        q: "Wie läuft das Coaching genau ab?",
        a: "Wir treffen uns online über Zoom (oder ein anderes Tool). Du kannst mir live zuschauen, Fragen stellen und alles direkt mit mir üben. Nach dem Termin erhältst du eine Aufzeichnung und ein kleines Workbook.",
      },
      {
        q: "Was brauche ich dafür?",
        a: "Einen Laptop, ein Tablet oder Smartphone mit stabiler Internetverbindung. Am besten hast du deine wichtigsten Tools (Bürsten, Lockenstab etc.) dabei, falls wir live üben.",
      },
      {
        q: "Kann ich vorab Themenwünsche äußern?",
        a: "Sehr gerne. Du kannst mir im Vorfeld mitteilen, welche Techniken, Looks oder Themen dir besonders wichtig sind.",
      },
      {
        q: "Wie lange dauert das Coaching?",
        a: "Das sprechen wir gemeinsam ab. Je nach Ziel und Thema dauert ein Termin in der Regel zwischen 1,5 und 3 Stunden. Gern vereinbaren wir auch mehrere Termine.",
      },
      {
        q: "Bekomme ich ein Zertifikat?",
        a: "Auf Wunsch stelle ich dir gern ein Teilnahmezertifikat aus, das du auch für deine Kundenkommunikation und dein Portfolio nutzen kannst.",
      },
      {
        q: "Wie kann ich mich anmelden?",
        a: "Schreib mir einfach eine Nachricht (per E-Mail, WhatsApp oder Instagram). Dann klären wir deine Wünsche und vereinbaren einen Termin.",
      },
      {
        q: "Was kostet das Coaching?",
        a: "Da jedes Coaching individuell ist, erstelle ich dir nach einem kurzen Kennenlerngespräch ein maßgeschneidertes Angebot. So zahlst du nur für das, was du wirklich brauchst.",
      },
    ],
    topic: "online-coaching",
    metaTitle: "Online-Coaching Brautstyling – live per Zoom",
    metaDescription:
      "Online-Coaching für Brautfrisuren, Braut-Make-up und Content-Fotografie: 1:1 per Zoom, mit Aufzeichnung und Workbook. Kostenloses Beratungsgespräch.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
