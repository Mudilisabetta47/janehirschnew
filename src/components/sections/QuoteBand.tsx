import { images } from "@/content/images";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { PhotoBackdrop } from "@/components/motion/PhotoBackdrop";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { LightLeak, Sparkles } from "@/components/ui/Sparkles";
import { Section } from "@/components/ui/Section";

/** Emotionaler Zitat-Moment mit Janes eigenen Worten (aus „Über mich“), Foto-Hintergrund und Funkeln. */
export function QuoteBand() {
  return (
    <Section tone="mocha" labelledBy="quote-title" className="isolate text-center">
      <PhotoBackdrop image={images.coaching} position="50% 55%" overlay={0.8} />
      <LightLeak className="left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 bg-rose/20" />
      <Sparkles />
      <BackdropWord text="mit Herz" className="left-1/2 top-[8%] -translate-x-1/2 text-bone/[0.05]" from="-10%" to="10%" />
      <div className="wrap relative flex flex-col items-center">
        <Reveal>
          <p className="script mb-8 text-5xl text-rose md:text-6xl">Meine Mission</p>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote id="quote-title" className="max-w-4xl font-display text-[clamp(1.9rem,4.4vw,3.9rem)] font-light italic leading-[1.12]">
            „Ich möchte dir die Sicherheit geben, die du brauchst – damit du selbstbewusst stylst und deine Bräute begeistert sind.“
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="script mt-10 text-5xl text-bone/90">Jane Hirsch</p>
        </Reveal>
        <Reveal delay={0.3} className="mt-12">
          <ButtonLink href="/kontakt?thema=erstgespraech" variant="light">
            Kostenloses Erstgespräch
          </ButtonLink>
        </Reveal>
      </div>
    </Section>
  );
}
