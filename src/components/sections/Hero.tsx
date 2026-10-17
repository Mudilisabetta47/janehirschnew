import { site } from "@/content/site";
import { images } from "@/content/images";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroSeal } from "./HeroSeal";

/** Vollbild-Hero: große Fotos als Hintergrund, Name + Signatur „Coaching“ darüber (wie auf der bisherigen Seite). */
export function Hero() {
  const photos = [images.hero, images.about, images.coaching];
  return (
    <section aria-labelledby="hero-title" className="on-dark grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-mocha text-bone">
      <HeroBackdrop photos={photos} />

      <div className="wrap relative w-full pb-16 pt-36 lg:pb-24">
        <div className="max-w-3xl">
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
              className="script pointer-events-none absolute -bottom-4 left-[40%] -rotate-6 text-[clamp(3.25rem,10vw,9rem)] text-rose [animation:fade-in_1.4s_1.2s_both] [text-shadow:0_2px_24px_rgb(0_0_0/0.45)] sm:left-[48%] lg:left-[52%]"
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
            <a href={`tel:${site.phone.tel}`} className="link-line text-sm tracking-wide text-bone/85 hover:text-bone">
              {site.phone.display}
            </a>
          </div>
        </div>

        <HeroSeal className="absolute bottom-16 right-5 hidden md:block lg:bottom-24 lg:right-10" />
      </div>

      <div aria-hidden="true" className="absolute inset-x-0 bottom-5 hidden justify-center lg:flex">
        <span className="flex flex-col items-center gap-3 text-[0.65rem] uppercase tracking-[0.35em] text-bone/60">
          Scroll
          <span className="h-10 w-px origin-top bg-bone/40 [animation:grow-line_2.4s_ease-in-out_infinite]" />
        </span>
      </div>
    </section>
  );
}
