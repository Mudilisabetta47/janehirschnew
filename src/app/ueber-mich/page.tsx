import { about } from "@/content/about";
import { images } from "@/content/images";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { ContactSection } from "@/components/sections/ContactSection";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { FramedImage } from "@/components/ui/FramedImage";
import { Monogram } from "@/components/ui/Monogram";
import Image from "next/image";

export const metadata = pageMetadata({
  title: "Über mich – Make-up Artist, Brautstylistin & Coach",
  description:
    "Ausbildung 2006 bei Horst Kirchberger in München, Film, TV und Fashion, 3. Platz Deutsche Make-up-Meisterschaften 2018 – heute spezialisiert auf Brautstyling-Coaching.",
  path: "/ueber-mich",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Über mich"
        title={"Aus Leidenschaft\nwurde Mission."}
        lead={about.lead}
        crumbs={[{ label: "Start", href: "/" }, { label: "Über mich" }]}
      />

      <section aria-label="Bildimpression" className="relative bg-mocha">
        <div className="frame-inset relative aspect-[16/10] w-full max-h-[85svh] overflow-hidden [--frame-gap:12px] md:aspect-[16/8] md:[--frame-gap:24px]">
          <Image src={images.duo.src} alt={images.duo.alt} fill priority sizes="100vw" className="object-cover object-[30%_30%] md:object-center" />
        </div>
      </section>

      <Section labelledBy="story-title">
        <h2 id="story-title" className="sr-only">
          Meine Geschichte
        </h2>
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Parallax from={0} to={60} className="lg:sticky lg:top-32">
              <FramedImage shape="arch" className="mx-auto max-w-sm" caption="Jane">
                <ImageSlot slot="about" tone="sand" sizes="(min-width:1024px) 24rem, 90vw" />
                {!images.about && <Monogram className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 text-ink/70" />}
              </FramedImage>
            </Parallax>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-16 md:space-y-24">
              {about.chapters.map((c, i) => (
                <Reveal as="article" key={c.title}>
                  <p className="eyebrow mb-4">
                    {String(i + 1).padStart(2, "0")} · {c.title}
                  </p>
                  <div className="space-y-5 text-lg md:text-xl md:leading-relaxed">
                    {c.text.map((t) => (
                      <p key={t.slice(0, 20)}>{t}</p>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-20 border-l-2 border-rose-deep pl-8">
              <p className="font-display text-3xl font-light italic leading-snug md:text-4xl">{about.closing}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="blush" labelledBy="refs-title">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow mb-6">Auswahl</p>
            <h2 id="refs-title" className="display-l mb-16">
              Meine Referenzen
            </h2>
          </Reveal>
          <Stagger className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {about.references.map((r) => (
              <StaggerItem key={r.title}>
                <h3 className="mb-5 border-b border-ink/20 pb-4 font-display text-3xl font-light italic">{r.title}</h3>
                <ul role="list" className="space-y-2 text-[0.97rem]">
                  {r.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      <ContactSection
        defaultTopic="erstgespraech"
        title="Lass uns sprechen"
        intro="Wenn du dich in meiner Geschichte wiedererkennst, schreib mir – im kostenlosen Erstgespräch lernen wir uns kennen."
        tone="bone"
      />
      <JsonLd data={breadcrumbLd([{ name: "Start", path: "/" }, { name: "Über mich", path: "/ueber-mich" }])} />
    </>
  );
}
