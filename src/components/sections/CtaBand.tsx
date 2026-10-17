import { site } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function CtaBand({
  title = "Starte jetzt deine Karriere.",
  text = "Schreib mir eine Nachricht, erzähl mir ein bisschen von dir – und wir finden gemeinsam heraus, welches Coaching dich am besten weiterbringt.",
  primary = { href: "/kontakt?thema=erstgespraech", label: "Kostenloses Erstgespräch" },
  secondary = { href: "/coaching", label: "Mein Service" },
}: {
  title?: string;
  text?: string;
  primary?: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
}) {
  return (
    <Section tone="mocha" labelledBy="cta-title" className="grain isolate overflow-hidden text-center">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(201_161_144/0.22),transparent)]" />
      <div className="wrap flex flex-col items-center">
        <Reveal>
          <p className="eyebrow mb-8">Bereit?</p>
        </Reveal>
        <SplitHeading id="cta-title" text={title} className="display-l max-w-4xl" />
        <Reveal delay={0.1}>
          <p className="lead mx-auto mt-8 max-w-xl">{text}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-12 flex flex-wrap items-center justify-center gap-5">
          <ButtonLink href={primary.href} variant="light">
            {primary.label}
          </ButtonLink>
          {secondary && (
            <ButtonLink href={secondary.href} variant="ghost" arrow={false}>
              {secondary.label}
            </ButtonLink>
          )}
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 text-sm text-bone/70">
            Oder ruf direkt an:{" "}
            <a href={`tel:${site.phone.tel}`} className="link-line text-bone">
              {site.phone.display}
            </a>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
