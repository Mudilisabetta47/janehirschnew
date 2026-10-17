import { testimonials } from "@/content/testimonials";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";

/** Rendert nur, wenn echte, freigegebene Stimmen hinterlegt sind (keine erfundenen Zitate). */
export function Testimonials() {
  if (testimonials.length === 0) return null;
  return (
    <Section labelledBy="testimonials-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow mb-6">Das sagen meine Teilnehmer</p>
          <h2 id="testimonials-title" className="display-l mb-16">
            Stimmen
          </h2>
        </Reveal>
        <Stagger as="ul" className="grid gap-12 md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem as="li" key={t.author + t.quote.slice(0, 12)}>
              <figure>
                <blockquote className="font-display text-3xl font-light italic leading-snug">„{t.quote}“</blockquote>
                <figcaption className="eyebrow mt-6">{t.author}</figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
