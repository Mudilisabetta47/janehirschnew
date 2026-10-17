import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { images } from "@/content/images";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata = pageMetadata({
  title: "Kontakt & Anfrage",
  description:
    "Kontaktiere Jane Hirsch: Anfrage zu Einzel-, Gruppen-, Salon- oder Online-Coaching, kostenloses Erstgespräch, Telefon +49 173 4113111, Weyhe bei Bremen.",
  path: "/kontakt",
});

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ thema?: string | string[] }> }) {
  const { thema } = await searchParams;
  const topic = Array.isArray(thema) ? thema[0] : thema;
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={"Hast du Fragen?\nSchreib mir."}
        lead="Ob kostenloses Erstgespräch, Anfrage zu einem Coaching oder einfach eine Frage – ich melde mich persönlich bei dir."
        image={images.contact}
        crumbs={[{ label: "Start", href: "/" }, { label: "Kontakt" }]}
      />
      <ContactSection defaultTopic={topic} title="Deine Nachricht" tone="bone" />
      <JsonLd data={breadcrumbLd([{ name: "Start", path: "/" }, { name: "Kontakt", path: "/kontakt" }])} />
    </>
  );
}
