import { audiences } from "@/content/about";

/** Laufband der Zielgruppen (reines CSS, pausiert bei Hover und bei reduzierter Bewegung). */
export function AudienceMarquee() {
  const row = (hidden: boolean) => (
    <ul role="list" aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {audiences.map((a) => (
        <li key={a} className="flex items-center whitespace-nowrap">
          <span className="px-8 font-display text-[clamp(1.6rem,3.4vw,2.75rem)] font-light italic md:px-12">{a}</span>
          <span aria-hidden="true" className="text-rose-deep">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Für wen meine Coachings sind" className="group overflow-hidden border-b border-ink/10 bg-bone py-7 md:py-9">
      <p className="sr-only">Meine Coachings richten sich an: {audiences.join(", ")}.</p>
      <div className="marquee-track flex w-max animate-marquee group-hover:[animation-play-state:paused]" aria-hidden="true">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
