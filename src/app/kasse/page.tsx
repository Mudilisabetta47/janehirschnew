import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({ title: "Kasse", description: "Kasse: Deine Angaben eingeben und das gewählte Coaching von Jane Hirsch sicher online bezahlen.", path: "/kasse" }),
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Kasse"
        title={"Fast\ngeschafft."}
        lead="Gib deine Daten ein, dann geht es weiter zur sicheren Zahlung. Den Termin stimmen wir danach persönlich ab."
        crumbs={[{ label: "Start", href: "/" }, { label: "Coaching", href: "/coaching" }, { label: "Kasse" }]}
        backdrop="Kasse"
      />
      <Section className="!pt-16 md:!pt-24">
        <div className="wrap">
          <Suspense>
            <CheckoutForm />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
