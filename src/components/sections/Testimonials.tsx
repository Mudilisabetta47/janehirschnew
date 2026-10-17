import { testimonials } from "@/content/testimonials";
import { rating } from "@/content/rating";
import { Reveal } from "@/components/motion/Reveal";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { Section } from "@/components/ui/Section";
import { StarRating } from "@/components/ui/StarRating";
import { TestimonialCarousel } from "./TestimonialCarousel";

/**
 * „Das sagen meine Teilnehmer“: Karussell mit den echten Stimmen der bisherigen Seite
 * plus 5-Sterne-Wert (Google, Quelle benannt). Keine erfundenen Zitate.
 */
export function Testimonials() {
  return (
    <Section labelledBy="reviews-title">
      <BackdropWord text="5 Sterne" className="-left-[2%] top-[0%] text-rose/[0.16]" from="-4%" to="8%" />
      <div className="wrap relative">
        <Reveal className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <p className="eyebrow mb-6">Bewertungen</p>
          <h2 id="reviews-title" className="display-l mb-10">
            Das sagen meine Teilnehmer
          </h2>
          <StarRating size="lg" />
          <p className="mt-6 text-muted">
            {rating.platform}-Bewertungen · Profil „{rating.profile}“ · Stand {rating.asOf}
          </p>
        </Reveal>

        {testimonials.length > 0 && (
          <Reveal delay={0.1}>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
