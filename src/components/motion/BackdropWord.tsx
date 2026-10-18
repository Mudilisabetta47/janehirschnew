"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Riesiges Signatur-Wort als Hintergrund-Ebene. Wandert beim Scrollen langsam seitlich
 * (Parallax). Rein dekorativ: aria-hidden, nicht klickbar, sehr geringe Deckkraft.
 */
export function BackdropWord({
  text,
  className = "",
  from = "-6%",
  to = "6%",
}: {
  text: string;
  className?: string;
  from?: string;
  to?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none absolute select-none whitespace-nowrap ${className}`}>
      {/* Text als CSS-Pseudoinhalt: rein dekorativ, kein Text im DOM (kein Kontrast-/Screenreader-Thema) */}
      <motion.span
        data-text={text}
        style={reduce ? undefined : { x }}
        className="backdrop-word script block will-change-transform text-[clamp(9rem,28vw,26rem)] leading-[0.8]"
      />
    </div>
  );
}
