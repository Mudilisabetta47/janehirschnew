import { about } from "@/content/about";
import { images } from "@/content/images";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { PhotoBackdrop } from "@/components/motion/PhotoBackdrop";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { Section } from "@/components/ui/Section";

const firms = about.references.find((r) => r.title === "Firmen")?.items ?? [];

/** „Meine Expertise“ – nur belegte Eckdaten aus dem Bestand (keine erfundenen Zähler). */
export function Expertise() {
  const stats = [
    { value: "2006", label: "Ausbildung bei Horst Kirchberger in München abgeschlossen" },
    { value: "2018", label: "3. Platz Deutsche Make-up-Meisterschaften" },
    { value: "6", label: "Coaching-Formate – vom 1:1 bis zum Salon-Team" },
  ];
  return (
    <Section tone="mocha" labelledBy="expertise-title" className="isolate">
      <PhotoBackdrop image={images.about} position="50% 25%" overlay={0.82} />
      <BackdropWord text="Expertise" className="-left-[3%] bottom-[-6%] text-bone/[0.05]" from="-5%" to="5%" />
      <div className="wrap relative">
        <Reveal>
          <p className="eyebrow mb-6">Erfahrung, die du lernen kannst</p>
        </Reveal>
        <SplitHeading id="expertise-title" text="Meine Expertise" className="display-l mb-16 md:mb-24" />

        <Stagger as="ul" className="grid gap-12 border-t border-bone/20 pt-12 md:grid-cols-3 md:gap-10">
          {stats.map((s) => (
            <StaggerItem as="li" key={s.value}>
              <span className="block font-display text-[clamp(5rem,12vw,9.5rem)] font-light leading-none text-rose">{s.value}</span>
              <span className="mt-5 block max-w-xs text-bone/85">{s.label}</span>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {firms.length > 0 && (
        <div className="relative mt-20 overflow-hidden border-y border-bone/15 py-6 md:mt-28">
          <p className="sr-only">Referenzen: {firms.join(", ")}.</p>
          <div className="marquee-track flex w-max animate-marquee" aria-hidden="true">
            {[0, 1].map((k) => (
              <ul key={k} role="list" className="flex shrink-0 items-center">
                {firms.map((f) => (
                  <li key={f} className="flex items-center whitespace-nowrap">
                    <span className="px-8 font-display text-2xl font-light italic text-bone/80 md:px-10 md:text-3xl">{f}</span>
                    <span className="text-rose">✦</span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
