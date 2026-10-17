import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Fill, LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  ...pageMetadata({ title: "Datenschutzerklärung", description: "Informationen zur Verarbeitung personenbezogener Daten auf jane-hirsch.de.", path: "/datenschutz" }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Datenschutz"
      lead="Wie mit deinen Daten auf dieser Website umgegangen wird – kurz, verständlich und vollständig."
      todo={[
        "Stripe als Zahlungsdienstleister ist ergänzt (Abschnitt 5): Konto, AV-Vertrag/Verantwortlichkeit und Rechnungseinstellungen klären.",
        "IONOS SE als Hoster und Mailanbieter ist eingetragen (laut Auftraggeber). Offen: Serverstandort/Paket und Speicherdauer der Server-Logfiles aus dem IONOS-Vertrag übernehmen; Auftragsverarbeitungsvertrag (AVV) mit IONOS abschließen bzw. bestätigen.",
        "Rechtsgrundlage der Formularverarbeitung (Art. 6 Abs. 1 lit. b bzw. f statt reiner Einwilligung) und Wortlaut der Zustimmungs-Checkbox rechtlich bestätigen.",
        "Aufsichtsbehörde (Anschrift aus öffentlicher Quelle, bitte gegenprüfen) und Rechteteil gegen den aktuellen Stand prüfen. Der bisherige Text stammt von hochzeitsstyling-jane.de und enthielt Abschnitte zu Kommentaren/Registrierung, die es hier nicht mehr gibt (entfernt).",
        "Der bisherige Text auf jane-hirsch.de („Privacy Policy“) stammte vom Theme-Hersteller (AxiomThemes) und wurde NICHT übernommen.",
      ]}
    >
      <h2>1. Verantwortliche</h2>
      <p>
        {site.name}
        <br />
        {site.address.street}, {site.address.zip} {site.address.city}
        <br />
        Telefon: {site.phone.display}
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>2. Das Wichtigste in Kürze</h2>
      <ul>
        <li>Diese Website setzt <strong>keine Cookies</strong> und <strong>keine Analyse- oder Marketing-Werkzeuge</strong> ein. Der Warenkorb merkt sich deine Auswahl nur lokal in deinem Browser.</li>
        <li>Schriften werden vom eigenen Server ausgeliefert – es werden keine Daten an Google Fonts oder andere Schriftanbieter übertragen.</li>
        <li>Personenbezogene Daten verarbeite ich nur, wenn du mir schreibst (Kontaktformular, E-Mail, Telefon) und für den technisch notwendigen Betrieb der Seite.</li>
      </ul>

      <h2>3. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird bei der IONOS SE, Elgendorfer Str. 57, 56410 Montabaur, gehostet (Serverstandort: <Fill>laut IONOS-Vertrag, z. B. Deutschland</Fill>). Mit dem Anbieter besteht ein Vertrag zur Auftragsverarbeitung. Beim Aufruf der Seite verarbeitet der Server automatisch technische Daten (Server-Logfiles): IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, übertragene Datenmenge, Referrer-URL sowie Browsertyp und Betriebssystem. Eine Zusammenführung mit anderen Datenquellen findet nicht statt.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Die Logfiles werden nach <Fill>Speicherdauer laut IONOS-Paket</Fill> gelöscht.
      </p>

      <h2>4. Kontaktformular und Anfragen</h2>
      <p>
        Wenn du das Formular nutzt, verarbeite ich die Angaben, die du eingibst: Name, E-Mail-Adresse, optional Telefonnummer und Salonname, das gewählte Thema, deine Nachricht sowie den Zeitpunkt deiner Bestätigung der Datenschutzhinweise. Die Daten dienen ausschließlich der Bearbeitung deiner Anfrage und möglichen Anschlussfragen.
      </p>
      <p>
        Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen auf deine Anfrage) bzw. – bei allgemeinen Fragen – Art. 6 Abs. 1 lit. f DSGVO. Die Nachricht wird per verschlüsselter Verbindung an mein E-Mail-Postfach übermittelt (Versand über den E-Mail-Dienst der IONOS SE; dort liegt auch das empfangende Postfach). Auf dem Server der Website werden Formularinhalte <strong>nicht gespeichert</strong>.
      </p>
      <p>
        Deine Anfrage bleibt in meinem Postfach, bis dein Anliegen erledigt ist, du Löschung verlangst oder der Zweck entfällt. Gesetzliche Aufbewahrungspflichten (z. B. für Handelsbriefe) bleiben unberührt.
      </p>

      <h3>Spam-Schutz</h3>
      <p>
        Zum Schutz vor automatisierten Anfragen nutzt das Formular ein verstecktes Feld, eine signierte Zeitprüfung und eine Begrenzung der Anfragen pro Zeitraum. Dafür werden technische Verbindungsmerkmale (z. B. IP-Adresse) nur kurzzeitig im Arbeitsspeicher des Servers verarbeitet und nicht dauerhaft gespeichert. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Es kommt kein externer Dienst (z. B. reCAPTCHA) zum Einsatz.
      </p>

      <h2>5. Online-Buchung und Zahlung (Stripe)</h2>
      <p>
        Wenn du ein Coaching online buchst, gibst du zuerst auf der Buchungsseite dieser Website Vorname, Nachname, Anschrift, E-Mail-Adresse sowie optional Firma, Telefonnummer, USt-IdNr. und einen Wunschzeitraum ein. Diese Angaben werden an unseren Zahlungsdienstleister Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland (Muttergesellschaft: Stripe, Inc., USA) übermittelt, der damit deinen Kundendatensatz und die Rechnung erstellt. Anschließend wirst du zur Bezahlseite von Stripe weitergeleitet und gibst dort dein Zahlungsmittel ein. Stripe verarbeitet diese Daten in eigener Verantwortung bzw. als Auftragsverarbeiter; Kartendaten gelangen nie auf diese Website. Auf dem Server dieser Website werden die Buchungsdaten nicht gespeichert.
      </p>
      <p>
        Ich erhalte nach erfolgreicher Zahlung eine Benachrichtigung per E-Mail mit Name, Kontaktdaten, Anschrift, gebuchtem Angebot, Betrag und deinem Wunschzeitraum, um den Termin abzustimmen und die Leistung zu erbringen. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) und Art. 6 Abs. 1 lit. c DSGVO (steuer- und handelsrechtliche Aufbewahrung). Eine Datenübermittlung in die USA kann nicht ausgeschlossen werden; sie stützt sich auf die Angemessenheitsentscheidung (EU-US Data Privacy Framework) bzw. Standardvertragsklauseln. Weitere Informationen: stripe.com/de/privacy. <Fill>Auftragsverarbeitung/Verantwortlichkeit mit Stripe-Konto und Steuerberatung abstimmen</Fill>
      </p>

      <h2>6. Kontakt per E-Mail oder Telefon</h2>
      <p>
        Wenn du mir per E-Mail schreibst oder anrufst, verarbeite ich deine Angaben zur Bearbeitung der Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO). E-Mail-Kommunikation kann Sicherheitslücken aufweisen; ein lückenloser Schutz vor dem Zugriff Dritter ist nicht möglich.
      </p>

      <h2>7. Cookies und Tracking</h2>
      <p>
        Diese Website setzt keine Cookies. Nur wenn du ein Coaching in den Warenkorb legst, speichert dein Browser diese Auswahl (Angebot und Anzahl, keine Personendaten) lokal im Endgerät (localStorage). Das ist für die Warenkorb-Funktion technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG) und wird nach der Bestellung bzw. beim Entfernen gelöscht; du kannst den Speicher jederzeit über die Browsereinstellungen löschen. Es gibt kein Tracking und keine Einwilligungsabfrage. Beim Wechsel zur Bezahlseite von Stripe (Abschnitt 5) gelten dort die Cookie- und Datenschutzbestimmungen von Stripe.
      </p>

      <h2>8. Links zu sozialen Netzwerken</h2>
      <p>
        Diese Seite verlinkt auf Instagram, TikTok und Facebook. Es werden keine Inhalte dieser Dienste eingebunden – eine Datenübertragung an die Anbieter findet erst statt, wenn du dem Link folgst. Dann gelten die Datenschutzbestimmungen des jeweiligen Anbieters.
      </p>

      <h2>9. Deine Rechte</h2>
      <p>Du hast gegenüber mir folgende Rechte hinsichtlich deiner personenbezogenen Daten:</p>
      <ul>
        <li>Auskunft über die gespeicherten Daten sowie Kopie (Art. 15 DSGVO)</li>
        <li>Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten (Art. 16 DSGVO)</li>
        <li>Löschung (Art. 17 DSGVO) bzw. Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO)</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO); eine formlose Nachricht per E-Mail genügt</li>
      </ul>
      <p>
        Bevor du rechtliche Schritte einleitest, schreib mir gern eine Nachricht – meist lässt sich alles schnell klären. Dein Beschwerderecht bei der zuständigen Aufsichtsbehörde bleibt unberührt. Zuständig ist die Landesbeauftragte für den Datenschutz Niedersachsen, Prinzenstraße 5, 30159 Hannover.
      </p>

      <h2>10. Speicherdauer und gesetzliche Aufbewahrung</h2>
      <p>
        Gespeicherte Daten werden gelöscht, sobald sie für ihren Zweck nicht mehr erforderlich sind und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Nach deutschem Recht gelten insbesondere 10 Jahre (§ 147 Abs. 1 AO, § 257 Abs. 1 Nr. 1 und 4, Abs. 4 HGB) und 6 Jahre (§ 257 Abs. 1 Nr. 2 und 3, Abs. 4 HGB).
      </p>

      <h2>11. TLS-Verschlüsselung</h2>
      <p>
        Diese Seite nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Du erkennst sie am „https://“ und am Schloss-Symbol in der Adresszeile deines Browsers.
      </p>

      <p className="!mt-12 text-sm text-muted">Stand: Oktober 2026 (Entwurf)</p>
    </LegalPage>
  );
}
