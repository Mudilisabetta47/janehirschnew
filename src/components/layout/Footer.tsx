import Link from "next/link";
import { legalNav, site } from "@/content/site";
import { services } from "@/content/services";

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-mocha text-bone">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-script text-[clamp(8rem,28vw,26rem)] leading-none text-bone/[0.045]">
        Jane Hirsch
      </div>

      <div className="wrap relative grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5">
          <p className="eyebrow mb-6">Kontakt</p>
          <p className="display-m max-w-md">Lass uns gemeinsam dafür sorgen, dass Brautfrisuren deine größte Stärke werden.</p>
          <address className="mt-8 space-y-1 not-italic text-bone/80">
            <p>
              {site.name}
              <br />
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <p className="pt-3">
              <a href={`tel:${site.phone.tel}`} className="link-line">
                {site.phone.display}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="link-line break-all">
                {site.email}
              </a>
            </p>
          </address>
        </div>

        <nav aria-label="Angebote" className="md:col-span-4 md:col-start-7">
          <p className="eyebrow mb-6">Coaching</p>
          <ul role="list" className="space-y-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/coaching/${s.slug}`} className="link-line text-bone/85 hover:text-bone">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Social Media" className="md:col-span-2">
          <p className="eyebrow mb-6">Folgen</p>
          <ul role="list" className="space-y-3">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-line text-bone/85 hover:text-bone">
                  {s.label}
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="relative border-t border-bone/15">
        <div className="wrap flex flex-col gap-3 py-6 text-sm text-bone/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. Alle Rechte vorbehalten.</p>
          <ul role="list" className="flex gap-6">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line hover:text-bone">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
