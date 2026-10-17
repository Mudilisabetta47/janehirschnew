import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

const instagram = site.social.find((s) => s.label === "Instagram");

/** Verweis auf die Ergebnisse früherer Teilnehmerinnen (laut Bestand: Instagram-Highlights „BBC 1–4“). */
export function ResultsBand() {
  if (!instagram) return null;
  return (
    <Section labelledBy="results-title" className="!py-20 md:!py-28">
      <div className="wrap grid items-center gap-10 border-y border-ink/15 py-14 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <p className="eyebrow mb-5">Ergebnisse ansehen</p>
          <h2 id="results-title" className="display-m max-w-2xl">
            Echte Frisuren meiner Teilnehmerinnen – in den Instagram-Highlights <em className="font-light">„BBC 1–4“</em>.
          </h2>
        </Reveal>
        <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
          <p className="mb-8 text-muted">Beim Durchswipen bekommst du auch einen ersten Eindruck von meinen Seminaren.</p>
          <ButtonLink href={instagram.href} variant="outline">
            {instagram.handle} auf Instagram
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
