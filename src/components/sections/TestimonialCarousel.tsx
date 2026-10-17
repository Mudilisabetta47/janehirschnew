"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Testimonial } from "@/content/testimonials";

/**
 * Karussell mit Scroll-Snap (Wischen am Handy, Pfeile/Tasten am Desktop).
 * Jede Karte: Profilfoto im Rosé-Ring, Zitat in der Display-Schrift, Name.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  const cardWidth = () => {
    const el = track.current?.querySelector("li");
    return el ? el.getBoundingClientRect().width + 24 : 360;
  };
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * cardWidth(), behavior: "smooth" });
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.min(items.length - 1, Math.round(el.scrollLeft / cardWidth())));
  };

  const arrow = "grid h-12 w-12 place-items-center rounded-full border border-ink/30 transition-colors duration-300 hover:bg-ink hover:text-bone focus-visible:outline-offset-4";

  return (
    <div role="region" aria-roledescription="Karussell" aria-label="Stimmen von Teilnehmerinnen">
      <ul
        ref={track}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Teilnehmer-Stimmen, mit Pfeiltasten scrollen"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-6 [scrollbar-width:none] md:-mx-10 md:px-10 xl:-mx-16 xl:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <li key={t.author + i} className="w-[84vw] max-w-[26rem] shrink-0 snap-start sm:w-[26rem]">
            <figure className="frame-inset relative flex h-full flex-col border border-ink/12 bg-bone p-8 [--frame-accent:rgb(138_90_72)] [--frame-gap:9px] [--frame-line:rgb(201_161_144/0.5)] md:p-10">
              <div className="mx-auto mb-8 h-28 w-28 rounded-full bg-[conic-gradient(from_140deg,#c9a190,#8a5a48,#e9d6c8,#c9a190)] p-[3px]">
                <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-bone bg-blush">
                  {t.avatar ? (
                    <Image src={t.avatar} alt="" fill sizes="112px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center font-display text-4xl text-rose-deep">{t.author.slice(0, 1)}</span>
                  )}
                </div>
              </div>
              <span aria-hidden="true" className="font-display text-6xl leading-none text-rose">
                „
              </span>
              <blockquote className="-mt-3 flex-1 font-display text-[1.45rem] font-light italic leading-snug">{t.quote}</blockquote>
              <figcaption className="mt-8 border-t border-ink/12 pt-5">
                <span className="block font-medium">{t.author}</span>
                {t.detail && <span className="text-sm text-muted">{t.detail}</span>}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <p aria-live="polite" className="text-sm tabular-nums text-muted">
          {index + 1} / {items.length}
        </p>
        <div className="flex gap-3">
          <button type="button" className={arrow} aria-label="Vorherige Stimme" onClick={() => go(-1)}>
            <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M18 5H2M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <button type="button" className={arrow} aria-label="Nächste Stimme" onClick={() => go(1)}>
            <svg aria-hidden="true" width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
