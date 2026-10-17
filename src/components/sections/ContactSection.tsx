import { site } from "@/content/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { BackdropWord } from "@/components/motion/BackdropWord";

export function ContactSection({
  defaultTopic,
  title = "Schreib mir",
  intro = "Erzähl mir ein bisschen von dir – dann finden wir heraus, wie ich dich optimal unterstützen kann.",
  tone = "blush",
  id = "anfrage",
}: {
  defaultTopic?: string;
  title?: string;
  intro?: string;
  tone?: "blush" | "mocha" | "bone";
  id?: string;
}) {
  const dark = tone === "mocha";
  return (
    <Section tone={tone} id={id} labelledBy={`${id}-title`}>
      <BackdropWord text="Hallo" className={`-right-[3%] -top-[3%] ${dark ? "text-bone/[0.05]" : "text-rose/[0.18]"}`} from="6%" to="-6%" />
      <div className="wrap relative grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="eyebrow mb-5">Kontakt</p>
          <h2 id={`${id}-title`} className="display-m mb-6">
            {title}
          </h2>
          <p className="lead mb-10">{intro}</p>
          <address className={`space-y-4 not-italic ${dark ? "text-bone/85" : "text-ink"}`}>
            <p>
              <span className="eyebrow mb-1 block">Telefon</span>
              <a href={`tel:${site.phone.tel}`} className="link-line text-lg">
                {site.phone.display}
              </a>
            </p>
            <p>
              <span className="eyebrow mb-1 block">E-Mail</span>
              <a href={`mailto:${site.email}`} className="link-line break-all text-lg">
                {site.email}
              </a>
            </p>
            <p>
              <span className="eyebrow mb-1 block">Adresse</span>
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
          </address>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
          <ContactForm defaultTopic={defaultTopic} tone={dark ? "dark" : "light"} />
        </Reveal>
      </div>
    </Section>
  );
}
