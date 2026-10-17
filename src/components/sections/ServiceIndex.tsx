import Link from "next/link";
import { services } from "@/content/services";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

/** Editorial-Liste aller Angebote. Jede Zeile ist ein vollständiger Link. */
export function ServiceIndex({ heading = true, tone = "bone" }: { heading?: boolean; tone?: "bone" | "blush" }) {
  return (
    <Section id="angebote" tone={tone} labelledBy={heading ? "services-title" : undefined} className={heading ? "" : "!pt-0"}>
      <div className="wrap">
        {heading && (
          <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Reveal>
                <p className="eyebrow mb-6">Mein Service</p>
              </Reveal>
              <SplitHeading id="services-title" text={"Coaching\n& Kurse"} className="display-l" />
            </div>
            <Reveal className="md:col-span-4" delay={0.15}>
              <p className="lead">
                Vom persönlichen 1:1-Coaching bis zum Team-Training im Salon – wähle das Format, das zu dir und deinem Level passt.
              </p>
            </Reveal>
          </div>
        )}

        <Stagger as="ul" stagger={0.07} className="border-t border-ink/20">
          {services.map((s) => (
            <StaggerItem as="li" key={s.slug} className="border-b border-ink/20">
              <Link
                href={`/coaching/${s.slug}`}
                className="group relative grid items-center gap-x-8 gap-y-3 py-9 transition-[padding,background-color] duration-700 ease-[var(--ease-out-expo)] hover:bg-blush/70 md:grid-cols-[4rem_1.2fr_1.4fr_11rem_2.5rem] md:py-11 md:hover:pl-6 md:hover:pr-4"
              >
                <span className="font-display text-lg tracking-[0.2em] text-rose-deep">{s.number}</span>
                <span>
                  <span className="block font-display text-[2.1rem] font-light leading-none transition-[font-style] md:text-5xl md:group-hover:italic">{s.title}</span>
                  <span className="mt-3 block text-sm text-muted md:hidden">{s.forWhom}</span>
                </span>
                <span className="hidden max-w-md text-muted md:block">{s.teaser}</span>
                <span className="text-sm md:text-right">
                  {s.price ? (
                    <>
                      <span className="block font-display text-2xl">{s.price}</span>
                      <span className="text-[0.78rem] text-muted">zzgl. MwSt.</span>
                    </>
                  ) : (
                    <span className="text-[0.78rem] uppercase tracking-[0.2em] text-muted">Auf Anfrage</span>
                  )}
                </span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden h-6 w-6 justify-self-end transition-transform duration-500 group-hover:translate-x-2 md:block" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M3 12h17M14 6l6 6-6 6" />
                </svg>
                <span className="sr-only">– {s.teaser}</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="mt-14 flex flex-wrap items-center gap-6">
          <ButtonLink href="/coaching" variant="outline">
            Alle Details &amp; Preise
          </ButtonLink>
          <p className="text-sm text-muted">Alle Preise zzgl. gesetzlicher MwSt. – Ratenzahlung nach Absprache möglich.</p>
        </Reveal>
      </div>
    </Section>
  );
}
