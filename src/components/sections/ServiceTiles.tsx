import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { images } from "@/content/images";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

/** „Mein Service“: sechs große Foto-Kacheln (wie auf der bisherigen Seite). Jede Kachel ist ein Link. */
export function ServiceTiles({ heading = true, tone = "blush" }: { heading?: boolean; tone?: "bone" | "blush" }) {
  return (
    <Section id="angebote" tone={tone} labelledBy={heading ? "services-title" : undefined} className={heading ? "" : "!pt-16 md:!pt-24"}>
      <BackdropWord text="Service" className="-right-[4%] top-[2%] text-rose/[0.18]" from="8%" to="-8%" />
      <div className="wrap relative">
        {heading && (
          <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
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

        <Stagger as="ul" stagger={0.08} className="grid gap-4 sm:grid-cols-2 lg:-mx-8 lg:grid-cols-3 lg:gap-5 xl:-mx-14">
          {services.map((s) => {
            const img = images.services[s.slug];
            return (
              <StaggerItem as="li" key={s.slug}>
                <Link
                  href={`/coaching/${s.slug}`}
                  className="on-dark group frame-inset relative isolate flex aspect-[4/5] flex-col justify-between overflow-hidden bg-mocha p-6 text-bone md:p-8 lg:aspect-[4/5] lg:p-10"
                >
                  {img && (
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 48vw, 94vw"
                      className="-z-10 object-cover transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.07]"
                      style={{ objectPosition: img.position ?? "50% 50%" }}
                    />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(36_27_23/0.92)_0%,rgb(36_27_23/0.35)_55%,rgb(36_27_23/0.1)_100%)] transition-opacity duration-700 group-hover:opacity-95" />

                  <span className="flex items-start justify-between">
                    <span className="font-display text-lg tracking-[0.25em]">{s.number}</span>
                    <span className="rounded-full border border-bone/50 px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] backdrop-blur-sm">
                      {s.price ? `${s.price}` : "Auf Anfrage"}
                    </span>
                  </span>

                  <span className="block">
                    <span className="block font-display text-4xl font-light leading-[1.02] md:text-[2.6rem]">{s.title}</span>
                    <span className="mt-4 grid grid-rows-[1fr] text-[0.95rem] text-bone/85 transition-[grid-template-rows,opacity] duration-700 ease-[var(--ease-out-expo)] md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 md:group-focus-visible:grid-rows-[1fr] md:group-focus-visible:opacity-100">
                      <span className="overflow-hidden">
                        {s.teaser}
                        <span className="mt-4 flex items-center gap-3 text-[0.72rem] uppercase tracking-[0.22em]">
                          Mehr erfahren
                          <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none" className="transition-transform duration-500 group-hover:translate-x-2">
                            <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </span>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-14 flex flex-wrap items-center gap-6">
          <ButtonLink href="/kontakt?thema=erstgespraech" variant="outline">
            Kostenloses Erstgespräch
          </ButtonLink>
          <p className="text-sm text-muted">Alle Preise zzgl. gesetzlicher MwSt. – Ratenzahlung nach Absprache möglich.</p>
        </Reveal>
      </div>
    </Section>
  );
}
