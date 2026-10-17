"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Dezenter Parallax-Versatz beim Scrollen (nur transform → GPU-freundlich).
 * `from`/`to` in Pixel. Bei reduzierter Bewegung statisch.
 */
export function Parallax({
  children,
  from = -40,
  to = 40,
  className = "",
}: {
  children: React.ReactNode;
  from?: number;
  to?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
