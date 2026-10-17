import { pageMetadata } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { AudienceMarquee } from "@/components/sections/AudienceMarquee";
import { Statement } from "@/components/sections/Statement";
import { ServiceIndex } from "@/components/sections/ServiceIndex";
import { AboutTeaser } from "@/components/sections/AboutTeaser";
import { Testimonials } from "@/components/sections/Testimonials";
import { ResultsBand } from "@/components/sections/ResultsBand";
import { CtaBand } from "@/components/sections/CtaBand";

const title = "Jane Hirsch · Brautstyling-Coaching & Make-up Artist in Weyhe bei Bremen";

// `absolute`: der Titel-Template (… | Jane Hirsch) soll die Startseite nicht doppeln.
export const metadata = {
  ...pageMetadata({
    title,
    description:
      "Brautstyling sicher erlernen: Einzel-, Gruppen-, Salon- und Online-Coaching für Brautfrisuren und Braut-Make-up von Make-up Artist Jane Hirsch. Jetzt kostenloses Erstgespräch anfragen.",
    path: "/",
  }),
  title: { absolute: title },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <AudienceMarquee />
      <Statement />
      <ServiceIndex tone="blush" />
      <AboutTeaser />
      <Testimonials />
      <ResultsBand />
      <CtaBand />
    </>
  );
}
