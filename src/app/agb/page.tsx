import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Fill, LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  ...pageMetadata({ title: "Allgemeine Geschäftsbedingungen", description: "AGB für die Buchung von Coachings, Workshops und Kursen bei Jane Hirsch.", path: "/agb" }),
  robots: { index: false, follow: true },
};

export default function AgbPage() {
  return (
    <LegalPage
      title="AGB"
      lead="Allgemeine Geschäftsbedingungen für Coachings, Workshops und Kurse."
      todo={[
        "Gesamter Text ist ein Entwurf ohne Rechtsprüfung. Alle gelb markierten Stellen sind geschäftliche Entscheidungen von Jane Hirsch (Storno, Verschiebung, Haftung bei Präsenzterminen) und dürfen nicht geraten werden.",
        "Kundenkreis: Entwurf geht von Unternehmern/Gewerbetreibenden aus (Preise „zzgl. MwSt.“). Falls auch Verbraucher buchen können: Brutto-Endpreise (PAngV), Widerrufsbelehrung und Muster-Widerrufsformular nötig.",
        "Ratenzahlung (2–3 Raten) läuft über Anfrage, nicht über den Online-Checkout – Konditionen festlegen.",
        "Zahlungsabwicklung über Stripe: Stripe-Konto, Rechnungs-/Steuereinstellungen und Zahlarten müssen mit Steuerberatung abgestimmt werden.",
      ]}
    >
      <h2>1. Geltungsbereich</h2>
      <p>
        Diese AGB gelten für alle Verträge über Coachings, Workshops und Kurse (Präsenz, im Salon und online) zwischen {site.name}, {site.address.street}, {site.address.zip} {site.address.city} (nachfolgend „Anbieterin“) und ihren Kundinnen und Kunden. Das Angebot richtet sich ausschließlich an Unternehmer im Sinne des § 14 BGB (z. B. Friseure, Kosmetiker, Visagisten, Make-up Artists, Salons).
      </p>

      <h2>2. Vertragsschluss</h2>
      <p>
        Die Darstellung der Angebote auf der Website ist unverbindlich. Bei Online-Buchung gibst du mit Abschluss des Bezahlvorgangs ein verbindliches Angebot ab; der Vertrag kommt zustande, wenn die Anbieterin die Buchung per E-Mail bestätigt oder den Termin abstimmt. Bei Anfragen über das Formular erstellt die Anbieterin ein individuelles Angebot; der Vertrag kommt mit dessen Annahme zustande.
      </p>

      <h2>3. Leistungen und Termine</h2>
      <p>
        Inhalt und Umfang der Leistungen ergeben sich aus der jeweiligen Angebotsbeschreibung. Termine werden nach der Buchung individuell abgestimmt. Bei Präsenzterminen gelten die dort genannten Orte; Fahrtkosten werden – soweit anfallend – gesondert vereinbart.
      </p>

      <h2>4. Preise und Zahlung</h2>
      <p>
        Alle Preise verstehen sich in Euro zuzüglich der gesetzlichen Umsatzsteuer. Die Online-Zahlung erfolgt über den Zahlungsdienstleister Stripe; die Rechnung wird elektronisch zugestellt. Ratenzahlung (2–3 Raten) ist nach Absprache möglich und nicht Teil des Online-Checkouts. Zahlungsziel bei Rechnungskauf: <Fill>Zahlungsziel in Tagen</Fill>.
      </p>

      <h2>5. Verschiebung und Stornierung durch den Kunden</h2>
      <p>
        <Fill>Regelung zu Verschiebung und Stornierung durch Jane Hirsch festlegen (Fristen, Gebühren)</Fill>
      </p>

      <h2>6. Absage oder Verschiebung durch die Anbieterin</h2>
      <p>
        <Fill>Regelung bei Krankheit/höherer Gewalt (Ersatztermin, Erstattung) festlegen</Fill>
      </p>

      <h2>7. Teilnahmevoraussetzungen, Material, Modelle</h2>
      <p>
        Soweit in der Angebotsbeschreibung genannt, bringen Teilnehmende eigene Werkzeuge mit; Produkte und Übungsköpfe werden gestellt. Für Modelle gilt die jeweilige Angebotsbeschreibung. <Fill>Ggf. Regelung zu Haftung für mitgebrachte Geräte/Modelle</Fill>
      </p>

      <h2>8. Zertifikat, Unterlagen, Aufzeichnungen</h2>
      <p>
        Teilnahmezertifikate und Handouts werden – soweit in der Angebotsbeschreibung genannt – ausgestellt. Die Unterlagen sind urheberrechtlich geschützt und nur für den eigenen Gebrauch bestimmt; eine Weitergabe oder Veröffentlichung ist nicht gestattet. Aufzeichnungen von Online-Terminen dienen ausschließlich den Teilnehmenden.
      </p>

      <h2>9. Haftung</h2>
      <p>
        <Fill>Haftungsregelung (Vorsatz/grobe Fahrlässigkeit, wesentliche Vertragspflichten) rechtlich formulieren lassen</Fill>
      </p>

      <h2>10. Schlussbestimmungen</h2>
      <p>
        Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, soweit zulässig, <Fill>Sitz der Anbieterin / Gerichtsort</Fill>. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.
      </p>

      <p className="!mt-12 text-sm text-muted">Stand: Oktober 2026 (Entwurf)</p>
    </LegalPage>
  );
}
