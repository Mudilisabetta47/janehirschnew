import Image from "next/image";
import Link from "next/link";
import type { SiteImage } from "@/content/images";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Crumb = { label: string; href?: string };

/**
 * Seitenkopf mit großem randlosem Foto (Angebotsseiten, Coaching-Übersicht):
 * Foto füllt die ganze Breite, Titel/Preis/CTA liegen unten links darüber.
 * Titel und Texte animieren per CSS (kein Warten auf die Hydration → schnelles LCP).
 */
export function ImageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  image: SiteImage;
  children?: React.ReactNode;
}) {
  return (
    <section className="on-dark grain relative isolate flex min-h-[82svh] items-end overflow-hidden bg-mocha text-bone md:min-h-[90svh]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="kenburns -z-10 object-cover"
        style={{ objectPosition: image.position ?? "50% 30%" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-rose-deep/20 mix-blend-multiply" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(36_27_23/0.95)_0%,rgb(36_27_23/0.6)_40%,rgb(36_27_23/0.15)_75%,rgb(36_27_23/0.35)_100%)]" />

      <div className="wrap w-full pb-14 pt-36 lg:pb-20">
        {crumbs && (
          <nav aria-label="Brotkrumen" className="mb-8 text-[0.78rem] uppercase tracking-[0.2em] text-bone/80">
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-3">
                  {c.href ? (
                    <Link href={c.href} className="link-line">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span aria-hidden="true">/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <p className="eyebrow fade-up mb-6">{eyebrow}</p>
        <SplitHeading as="h1" immediate text={title} className="display-xl max-w-5xl !text-[clamp(3rem,8.4vw,8.25rem)]" />
        {lead && (
          <p className="lead fade-up mt-8 max-w-2xl" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className="fade-up mt-9" style={{ "--d": "0.4s" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
