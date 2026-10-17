import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import { images } from "@/content/images";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { Statement } from "@/components/sections/Statement";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = pageMetadata({
  title: "Coaching & Kurse für Brautstyling",
  description:
    "Einzelcoaching, Gruppencoaching, Saloncoaching, Watch & Learn, Braut-Make-up-Coaching und Online-Coaching – alle Angebote von Jane Hirsch mit Preisen im Überblick.",
  path: "/coaching",
});

export default function CoachingPage() {
  return (
    <>
      <PageHero
        eyebrow="Mein Service"
        title={"Coaching\n& Kurse"}
        lead="Willkommen zu meinen Coachings: sechs Formate für alle, die Bräute professionell stylen oder ihr Können im Brautstyling ausbauen möchten."
        image={images.coaching}
        crumbs={[{ label: "Start", href: "/" }, { label: "Coaching" }]}
      />
      <ServiceIndex heading={false} />
      <Statement />
      <CtaBand title="Welches Format passt zu dir?" text="Du bist unsicher, welches Coaching das richtige ist? Schreib mir – im kostenlosen Erstgespräch finden wir es gemeinsam heraus." secondary={null} />
      <JsonLd data={breadcrumbLd([{ name: "Start", path: "/" }, { name: "Coaching", path: "/coaching" }])} />
    </>
  );
}
