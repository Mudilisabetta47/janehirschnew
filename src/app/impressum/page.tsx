import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { Fill, LegalPage } from "@/components/legal/LegalPage";

export const metadata = {
  ...pageMetadata({ title: "Impressum", description: "Impressum und Anbieterkennzeichnung von Jane Hirsch, Weyhe.", path: "/impressum" }),
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      lead="Angaben zum Anbieter dieser Website."
      todo={[
        "Bestand nennt „§ 5 TMG“ – seit Mai 2024 gilt § 5 DDG (Digitale-Dienste-Gesetz). Überschrift wurde angepasst; Inhalt prüfen lassen.",
        "USt-IdNr. von Jane Hirsch eintragen (Pflichtangabe nach § 5 Abs. 1 Nr. 6 DDG; im Bestand fehlte sie).",
        "Laut Auftraggeber arbeitet Jane Hirsch als Make-up Artist und Coach, nicht als eingetragener Friseurbetrieb → keine Kammerangaben. Bitte rechtlich bestätigen (insb. falls Frisurleistungen am Kunden erbracht werden).",
        "Telefonnummer im Bestand in zwei Schreibweisen – hier vereinheitlicht.",
      ]}
    >
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        {site.name}
        <br />
        {site.address.street}
        <br />
        {site.address.zip} {site.address.city}
      </p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
        <br />
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: <Fill>USt-IdNr. (Format DE + 9 Ziffern)</Fill>
      </p>

      <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
      <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
    </LegalPage>
  );
}
