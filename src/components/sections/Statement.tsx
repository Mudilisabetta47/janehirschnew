import { pillars } from "@/content/about";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Section } from "@/components/ui/Section";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { LightLeak } from "@/components/ui/Sparkles";

export function Statement() {
  return (
    <Section id="haltung" labelledBy="statement-title">
      <LightLeak className="-left-[10%] top-[20%] h-[55vmin] w-[55vmin] bg-rose/20" />
      <BackdropWord text="Brautstyling" className="-left-[2%] top-[4%] text-rose/[0.16]" from="-4%" to="10%" />
      <svg aria-hidden="true" viewBox="0 0 600 700" className="pointer-events-none absolute -right-20 bottom-0 hidden h-[85%] text-rose-deep/15 md:block" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M60 700V300a240 240 0 0 1 480 0v400" />
        <path d="M110 700V310a190 190 0 0 1 380 0v390" />
        <path d="M160 700V320a140 140 0 0 1 280 0v380" />
      </svg>
      <div className="wrap relative">
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
