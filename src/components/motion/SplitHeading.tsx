"use client";

import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

type Props = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  /** true: sofort beim Laden (Hero), false: beim Scrollen */
  immediate?: boolean;
  /** Zusätzlicher, nur für Screenreader sichtbarer Text */
  srSuffix?: string;
  id?: string;
};

/**
 * Überschrift mit maskiertem Wort-für-Wort-Reveal. `\n` im Text erzeugt Zeilenumbrüche.
 * Für Screenreader bleibt der Text als Ganzes erhalten (aria-label + sichtbare Wörter aria-hidden).
 */
export function SplitHeading({ text, as = "h2", className = "", delay = 0, immediate = false, srSuffix, id }: Props) {
  const Tag = motion[as] as typeof motion.h2;
  const lines = text.split("\n");
  let index = 0;

  // Hero-/Seitentitel (LCP-relevant): reine CSS-Animation, unabhängig von der Hydration → früher sichtbar.
  if (immediate) {
    const Static = as;
    return (
      <Static id={id} className={className}>
        <span className="sr-only">
          {lines.join(" ")}
          {srSuffix}
        </span>
        <span aria-hidden="true">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.split(" ").map((word) => (
                <span key={index++} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                  <span className="word-rise inline-block" style={{ animationDelay: `${delay + index * 0.07}s` }}>
                    {word}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </Static>
    );
  }

  const view = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, margin: "0px 0px -10% 0px" } };

  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      {...view}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }}
    >
      <span className="sr-only">
        {lines.join(" ")}
        {srSuffix}
      </span>
      <span aria-hidden="true">
        {lines.map((line, li) => (
          <span key={li} className="block">
            {line.split(" ").map((word) => (
              <span key={index++} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
                <motion.span
                  className="inline-block will-change-transform"
                  variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1.05, ease } } }}
                >
                  {word}&nbsp;
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
