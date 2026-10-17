import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HeroArt } from "./HeroArt";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { images } from "@/content/images";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark grain relative isolate overflow-hidden bg-mocha text-bone">
      {/* weiches Licht */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-1/4 -top-1/3 -z-10 h-[90vmin] w-[90vmin] rounded-full bg-[radial-gradient(closest-side,rgb(201_161_144/0.30),transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-1/3 -left-1/4 -z-10 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(closest-side,rgb(138_90_72/0.28),transparent)]" />

      <div className="wrap grid min-h-[100svh] items-end gap-10 pb-16 pt-32 lg:grid-cols-12 lg:gap-6 lg:pb-20 lg:pt-36">
        <div className="relative lg:col-span-7">
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-rose" />
            {site.tagline}
          </p>

          <div className="relative">
            <SplitHeading
              as="h1"
              immediate
              delay={0.15}
              text={"Jane\nHirsch"}
              srSuffix=" – Brautstyling-Coaching und Make-up Artist in Weyhe bei Bremen"
              className="display-xl"
            />
            <span
              aria-hidden="true"
              className="script pointer-events-none absolute -bottom-4 left-[40%] -rotate-6 text-[clamp(3.25rem,10vw,9rem)] text-rose [animation:fade-in_1.4s_1.2s_both] sm:left-[48%] lg:left-[52%]"
            >
              Coaching
            </span>
          </div>

          <p className="lead mt-14 max-w-xl md:mt-16">
            Mit meiner Erfahrung als Hair- &amp; Make-up Artist zeige ich dir, wie du Brautstyling sicher erlernst – damit du deine Kreativität entfalten, Bräute zum Strahlen bringen und mit deinem Können unvergessliche Momente schaffen kannst.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="/coaching" variant="light">
              Coaching entdecken
            </ButtonLink>
            <ButtonLink href="/kontakt?thema=erstgespraech" variant="ghost" arrow={false}>
              Kostenloses Erstgespräch
            </ButtonLink>
            <a href={`tel:${site.phone.tel}`} className="link-line text-sm tracking-wide text-bone/80 hover:text-bone">
              {site.phone.display}
            </a>
          </div>
        </div>

        <div className="relative pb-6 lg:col-span-5 lg:pb-0">
          <HeroArt>{images.hero ? <ImageSlot slot="hero" priority sizes="(min-width:1024px) 34rem, 90vw" /> : undefined}</HeroArt>
        </div>
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-5 hidden justify-center lg:flex">
        <span className="flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-bone/55">
          Scroll
          <span className="h-10 w-px origin-top bg-bone/40 [animation:grow-line_2.4s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
