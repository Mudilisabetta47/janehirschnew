import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/sections/PageHero";

export const metadata = { title: "Seite nicht gefunden", robots: { index: false } };

export default function NotFound() {
  return (
    <PageHero eyebrow="Fehler 404" title={"Diese Seite\ngibt es nicht."} lead="Der Link ist veraltet oder die Adresse hat einen Tippfehler. Hier geht es weiter:">
      <div className="flex flex-wrap gap-5">
        <ButtonLink href="/">Zur Startseite</ButtonLink>
        <ButtonLink href="/coaching" variant="outline">
          Coaching ansehen
        </ButtonLink>
      </div>
    </PageHero>
  );
}
