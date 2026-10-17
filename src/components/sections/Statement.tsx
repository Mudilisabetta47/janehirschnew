import { pillars } from "@/content/about";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Section } from "@/components/ui/Section";

export function Statement() {
  return (
    <Section id="haltung" labelledBy="statement-title">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow mb-8">Mein Ansatz</p>
        </Reveal>
        <SplitHeading
          id="statement-title"
          text={"Von der Unsicherheit zur sicheren Hand im Brautstyling – und zu dem Selbstvertrauen, das du dir wünschst."}
          className="display-l max-w-6xl"
        />

        <Stagger as="ul" className="mt-20 grid gap-12 border-t border-ink/15 pt-12 md:mt-28 md:grid-cols-3 md:gap-10">
          {pillars.map((p) => (
            <StaggerItem as="li" key={p.n}>
              <span className="font-display text-sm tracking-[0.3em] text-rose-deep">{p.n}</span>
              <h3 className="mt-4 font-display text-4xl font-light italic md:text-5xl">{p.title}</h3>
              <p className="mt-5 max-w-sm text-muted">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
