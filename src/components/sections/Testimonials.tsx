import { testimonials } from "@/content/testimonials";
import { rating } from "@/content/rating";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { Section } from "@/components/ui/Section";
import { StarRating } from "@/components/ui/StarRating";

/**
 * Bewertungen: 5-Sterne-Wert (Google, Quelle benannt) – und echte Zitate, sobald welche hinterlegt sind.
 * Es werden keine Zitate erfunden.
 */
export function Testimonials() {
  return (
    <Section labelledBy="reviews-title">
      <BackdropWord text="5 Sterne" className="-left-[2%] top-[0%] text-rose/[0.16]" from="-4%" to="8%" />
      <div className="wrap relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">Bewertungen</p>
          <h2 id="reviews-title" className="display-l mb-10">
            Fünf Sterne.
          </h2>
          <StarRating size="lg" />
          <p className="mt-6 text-muted">
            {rating.platform}-Bewertungen · Profil „{rating.profile}“ · Stand {rating.asOf}
          </p>
        </Reveal>

        {testimonials.length > 0 && (
          <Stagger as="ul" className="mt-20 grid gap-12 md:grid-cols-2">
            {testimonials.map((t) => (
              <StaggerItem as="li" key={t.author + t.quote.slice(0, 12)}>
                <figure>
                  <blockquote className="font-display text-3xl font-light italic leading-snug">„{t.quote}“</blockquote>
                  <figcaption className="eyebrow mt-6">{t.author}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </Section>
  );
}
