import { about } from "@/content/about";
import { images } from "@/content/images";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Section } from "@/components/ui/Section";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { Monogram } from "@/components/ui/Monogram";

export function AboutTeaser() {
  return (
    <Section tone="blush" labelledBy="about-title">
      <BackdropWord text="Jane" className="-right-[2%] -top-[2%] text-rose/[0.2]" from="6%" to="-8%" />
      <div className="wrap relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-5">
          <Parallax from={-30} to={30}>
            <div className="arch relative mx-auto aspect-[4/5] max-w-md overflow-hidden">
              <ImageSlot slot="about" tone="sand" sizes="(min-width:1024px) 28rem, 90vw" />
              {!images.about && <Monogram className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-ink/70" />}
            </div>
          </Parallax>
          <p aria-hidden="true" className="script absolute -bottom-6 -right-2 hidden text-7xl text-rose-deep md:block lg:right-4">
            mit Herz
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow mb-6">Über mich</p>
          </Reveal>
          <SplitHeading id="about-title" text={"Aus Leidenschaft\nwurde Mission."} className="display-l mb-10" />
          <Reveal delay={0.1}>
            <p className="lead mb-8">
              Schon als Kind hat mich die Beautywelt verzaubert. Heute ist es meine Mission, dir die Sicherheit zu geben, die du brauchst – damit du selbstbewusst stylst, auch bei schwierigen Haaren Lösungen findest und deine Bräute begeistert sind.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mb-10 divide-y divide-ink/15 border-y border-ink/15">
              {about.milestones.map((m) => (
                <div key={m.year} className="grid grid-cols-[5.5rem_1fr] gap-4 py-4">
                  <dt className="font-display text-xl text-rose-deep">{m.year}</dt>
                  <dd>{m.text}</dd>
                </div>
              ))}
            </dl>
            <ButtonLink href="/ueber-mich">Meine Geschichte</ButtonLink>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
