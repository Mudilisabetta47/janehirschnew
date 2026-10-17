import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { PageHero } from "@/components/sections/PageHero";
import { Section } from "@/components/ui/Section";
import { CheckoutForm } from "@/components/forms/CheckoutForm";
import { pageMetadata } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.filter((s) => s.booking).map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s?.booking) return {};
  return {
    ...pageMetadata({ title: `${s.title} buchen`, description: `Online buchen: ${s.title} – Angaben eingeben und sicher bezahlen.`, path: `/buchen/${s.slug}` }),
    robots: { index: false, follow: false },
  };
}

export default async function BookingPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s?.booking) notFound();

  return (
    <>
      <PageHero
        eyebrow="Online buchen"
        title={`${s.title}\nbuchen`}
        lead="Gib deine Daten ein, dann geht es weiter zur sicheren Zahlung. Den Termin stimmen wir danach persönlich ab."
        crumbs={[{ label: "Start", href: "/" }, { label: "Coaching", href: "/coaching" }, { label: s.title, href: `/coaching/${s.slug}` }, { label: "Buchen" }]}
        backdrop="Buchen"
      />
      <Section labelledBy={undefined} className="!pt-16 md:!pt-24">
        <div className="wrap">
          <Suspense>
            <CheckoutForm slug={s.slug} title={s.title} teaser={s.teaser} booking={s.booking} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
