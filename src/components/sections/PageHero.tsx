import Image from "next/image";
import Link from "next/link";
import type { SiteImage } from "@/content/images";
import { BackdropWord } from "@/components/motion/BackdropWord";
import { SplitHeading } from "@/components/motion/SplitHeading";

type Crumb = { label: string; href?: string };

/** Einheitlicher Seitenkopf aller Unterseiten: Brotkrumen, Eyebrow, große Überschrift, Lead, feine Bogenlinien. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  image,
  backdrop = "Brautstyling",
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  /** Optionales Foto im Bogenfenster rechts (ab Tablet), auf dem Smartphone darunter */
  image?: SiteImage | null;
  /** Großes Signatur-Wort im Hintergrund */
  backdrop?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-blush pb-20 pt-36 md:pb-28 md:pt-48">
      <svg aria-hidden="true" viewBox="0 0 600 700" className={`pointer-events-none absolute -right-24 -top-10 -z-10 hidden h-[130%] text-rose-deep/20 ${image ? "" : "md:block"}`} fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M60 700V300a240 240 0 0 1 480 0v400" />
        <path d="M110 700V310a190 190 0 0 1 380 0v390" />
        <path d="M160 700V320a140 140 0 0 1 280 0v380" />
      </svg>
      <BackdropWord text={backdrop} className="-bottom-[6%] -left-[2%] text-rose/[0.2]" from="-4%" to="6%" />
      <div className={`wrap relative ${image ? "grid items-end gap-12 lg:grid-cols-12" : ""}`}>
        <div className={image ? "lg:col-span-6" : ""}>
        {crumbs && (
          <nav aria-label="Brotkrumen" className="mb-10 text-[0.78rem] uppercase tracking-[0.2em] text-muted">
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
        <p className="eyebrow fade-up mb-7">{eyebrow}</p>
        <SplitHeading
          as="h1"
          immediate
          text={title}
          className={`display-xl max-w-5xl ${image ? "!text-[clamp(2.75rem,6.4vw,6.25rem)]" : "!text-[clamp(3rem,9vw,8rem)]"}`}
        />
        {lead && (
          <p className="lead fade-up mt-10 max-w-2xl" style={{ "--d": "0.3s" } as React.CSSProperties}>
            {lead}
          </p>
        )}
        {children && (
          <div className="fade-up mt-10" style={{ "--d": "0.4s" } as React.CSSProperties}>
            {children}
          </div>
        )}
        </div>
        {image && (
          <div className="fade-up lg:col-span-5 lg:col-start-8" style={{ "--d": "0.25s" } as React.CSSProperties}>
            <div className="arch relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden lg:max-w-none">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} priority sizes="(min-width:1024px) 30vw, 80vw" className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
