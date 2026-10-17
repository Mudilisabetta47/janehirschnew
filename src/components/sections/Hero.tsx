import { site } from "@/content/site";
import { images } from "@/content/images";
import { ButtonLink } from "@/components/ui/Button";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroSeal } from "./HeroSeal";
import { StarRating } from "@/components/ui/StarRating";

/** Vollbild-Hero: große Fotos als Hintergrund, Name + Signatur „Coaching“ darüber (wie auf der bisherigen Seite). */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="on-dark grain relative isolate flex min-h-[100svh] items-end overflow-hidden bg-mocha text-bone">
      <HeroBackdrop image={images.duo} />

      <div className="wrap relative w-full pb-14 pt-36 lg:pb-20">
        <div className="max-w-4xl">
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-10 bg-rose" />
            {site.tagline}
          </p>

          <div className="relative inline-block">
            <SplitHeading
              as="h1"
              immediate
              delay={0.15}
              text={"Jane Hirsch"}
              srSuffix=" – Brautstyling-Coaching und Make-up Artist in Weyhe bei Bremen"
              className="display-xl !text-[clamp(3.4rem,8vw,8rem)]"
            />
            <span
              aria-hidden="true"
              className="script pointer-events-none absolute -bottom-9 right-0 -rotate-6 text-[clamp(3rem,8vw,7.5rem)] text-rose [animation:fade-in_1.4s_1.2s_both] [text-shadow:0_2px_24px_rgb(0_0_0/0.5)] md:-bottom-14 md:-right-[22%]"
            >
              Coaching
            </span>
          </div>

          <p className="lead mt-14 max-w-xl md:mt-16">
            Mit meiner Erfahrung als Hair- &amp; Make-up Artist zeige ich dir, wie du Brautstyling sicher erlernst – damit du deine Kreativität entfalten, Bräute zum Strahlen bringen und mit deinem Können unvergessliche Momente schaffen kannst.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 md:mt-9">
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
          <StarRating className="mt-7 text-bone" />
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
