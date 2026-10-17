import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getService, services } from "@/content/services";
import { images } from "@/content/images";
import { site } from "@/content/site";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { ImageHero } from "@/components/sections/ImageHero";
import { PhotoBand } from "@/components/sections/PhotoBand";
import { ContactSection } from "@/components/sections/ContactSection";
import { BookingPanel } from "@/components/forms/BookingPanel";
import { Accordion } from "@/components/ui/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

// Online-Buchung erscheint nur, wenn der Checkout bewusst aktiviert wurde (Build-Variable).
const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === "true";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/coaching/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const others = services.filter((o) => o.slug !== s.slug);
  const heroImg = images.services[s.slug] ?? images.overview;
  // Foto-Bahn: drei andere Bilder als im Seitenkopf
  const band = [images.hero, images.coaching, images.about, images.services.gruppencoaching!].filter((i) => i.src !== heroImg.src).slice(0, 3);
  const path = `/coaching/${s.slug}`;

  return (
    <>
      <ImageHero
        eyebrow={`Coaching ${s.number}`}
        title={s.title}
        lead={s.teaser}
        image={images.services[s.slug] ?? images.overview}
        crumbs={[{ label: "Start", href: "/" }, { label: "Coaching", href: "/coaching" }, { label: s.title }]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          {s.booking && checkoutEnabled && (
            <ButtonLink href="#buchen" variant="light">
              Direkt buchen
            </ButtonLink>
          )}
          <ButtonLink href={`/kontakt?thema=${s.topic}#anfrage`} variant={s.booking && checkoutEnabled ? "ghost" : "light"}>
            Jetzt anfragen
          </ButtonLink>
          {s.price ? (
            <p className="font-display text-3xl">
              {s.price}
              <span className="ml-3 font-sans text-sm text-bone/80">{s.priceNote}</span>
            </p>
          ) : (
            <p className="text-sm uppercase tracking-[0.2em] text-bone/80">{s.priceNote}</p>
          )}
        </div>
      </ImageHero>

      <Section labelledBy="detail-title" className="!pb-12 md:!pb-20">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SplitHeading id="detail-title" text={s.headline} className="display-m mb-10" />
            <div className="space-y-6 text-lg">
              {s.intro.map((p) => (
                <Reveal key={p.slice(0, 24)}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>

            {s.painPoints && (
              <Reveal className="mt-16">
                <h3 className="mb-6 font-display text-3xl font-light italic">{s.painPoints.title}</h3>
                <ul role="list" className="divide-y divide-ink/15 border-y border-ink/15">
                  {s.painPoints.items.map((it) => (
                    <li key={it} className="flex gap-4 py-4">
                      <span aria-hidden="true" className="mt-[0.6em] h-px w-5 shrink-0 bg-rose-deep" />
                      {it}
                    </li>
                  ))}
                </ul>
                {s.painPoints.outro && <p className="mt-8 text-muted">{s.painPoints.outro}</p>}
              </Reveal>
            )}

            {s.contentIncomplete && (
              <Reveal className="mt-16 border-l-2 border-rose-deep pl-6">
                <p className="font-display text-2xl font-light italic">Ablauf und Inhalte besprechen wir persönlich.</p>
                <p className="mt-3 text-muted">
                  Schreib mir kurz, was du bereits kannst und was du lernen möchtest – dann klären wir, ob Watch &amp; Learn das passende Format ist.
                </p>
              </Reveal>
            )}
          </div>

          <aside aria-label="Auf einen Blick" className="lg:col-span-4 lg:col-start-9">
            <Reveal className="top-28 lg:sticky">
              <div className="on-dark bg-mocha p-8 text-bone md:p-10">
                <p className="eyebrow mb-6">Auf einen Blick</p>
                <dl className="divide-y divide-bone/15">
                  {s.facts.map((f) => (
                    <div key={f.label} className="py-4 first:pt-0">
                      <dt className="text-[0.72rem] uppercase tracking-[0.22em] text-rose">{f.label}</dt>
                      <dd className="mt-1">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                <ButtonLink href={`/kontakt?thema=${s.topic}#anfrage`} variant="light" className="mt-8 w-full">
                  Anfrage senden
                </ButtonLink>
                <p className="mt-6 text-center text-sm text-bone/70">
                  oder anrufen:{" "}
                  <a href={`tel:${site.phone.tel}`} className="link-line text-bone">
                    {site.phone.display}
                  </a>
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </Section>

      <PhotoBand shots={band} />

      {s.blocks.length > 0 && (
        <Section tone="blush" labelledBy="program-title">
          <div className="wrap">
            <Reveal>
              <p className="eyebrow mb-6">Inhalte &amp; Ablauf</p>
              <h2 id="program-title" className="display-l mb-16 max-w-3xl">
                Was dich erwartet
              </h2>
            </Reveal>
            <Stagger as="ol" className="grid gap-px bg-ink/15 md:grid-cols-2 md:[&>li:last-child:nth-child(odd)]:col-span-2">
              {s.blocks.map((b, i) => (
                <StaggerItem as="li" key={b.title} className="bg-blush p-8 md:p-12">
                  <span className="font-display text-sm tracking-[0.3em] text-rose-deep">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mb-5 mt-3 font-display text-3xl font-light leading-tight">{b.title}</h3>
                  {b.lead && <p className="mb-5 text-muted">{b.lead}</p>}
                  <ul role="list" className="space-y-3">
                    {b.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rotate-45 bg-rose-deep" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </StaggerItem>
              ))}
            </Stagger>

            {s.benefits && (
              <Reveal className="mt-16 grid gap-8 md:grid-cols-12">
                <h3 className="font-display text-4xl font-light italic md:col-span-4">{s.benefits.title}</h3>
                <ul role="list" className="space-y-4 md:col-span-8">
                  {s.benefits.items.map((it) => (
                    <li key={it} className="flex gap-4 border-b border-ink/15 pb-4 text-lg">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-6 shrink-0 bg-rose-deep" />
                      {it}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </Section>
      )}

      {s.faq.length > 0 && (
        <Section labelledBy="faq-title">
          <div className="wrap grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow mb-6">Häufig gestellte Fragen</p>
              <h2 id="faq-title" className="display-m">
                Gut zu wissen
              </h2>
              <p className="mt-6 text-muted">Deine Frage ist nicht dabei? Schreib mir einfach – ich antworte persönlich.</p>
            </Reveal>
            <Reveal className="lg:col-span-8" delay={0.1}>
              <Accordion items={s.faq} />
            </Reveal>
          </div>
        </Section>
      )}

      {s.booking && checkoutEnabled && (
        <Section id="buchen" labelledBy="buchen-title">
          <div className="wrap">
            <BookingPanel slug={s.slug} title={s.title} booking={s.booking} />
          </div>
        </Section>
      )}

      <ContactSection
        defaultTopic={s.topic}
        title={`Anfrage: ${s.title}`}
        intro="Schreib mir eine Nachricht, erzähl mir ein bisschen von dir – gern erstelle ich dir ein individuelles Angebot, das genau zu dir passt."
        tone="mocha"
        id="anfrage"
      />

      <Section labelledBy="more-title" className="!py-20 md:!py-28">
        <div className="wrap">
          <h2 id="more-title" className="eyebrow mb-10">
            Weitere Angebote
          </h2>
          <ul role="list" className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-5">
            {others.map((o) => (
              <li key={o.slug} className="bg-bone">
                <Link href={`/coaching/${o.slug}`} className="group block h-full p-6 transition-colors duration-500 hover:bg-blush">
                  <span className="font-display text-sm tracking-[0.3em] text-rose-deep">{o.number}</span>
                  <span className="mt-3 block font-display text-2xl font-light leading-tight group-hover:italic">{o.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <JsonLd
        data={[
          serviceLd(s),
          ...(s.faq.length ? [faqLd(s.faq)] : []),
          breadcrumbLd([
            { name: "Start", path: "/" },
            { name: "Coaching", path: "/coaching" },
            { name: s.title, path },
          ]),
        ]}
      />
    </>
  );
}
