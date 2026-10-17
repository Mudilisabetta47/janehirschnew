"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { SiteImage } from "@/content/images";

/** Foto als Abschnitts-Hintergrund mit Parallax und dunkler Abdeckung (Text bleibt lesbar). */
export function PhotoBackdrop({
  image,
  position = "50% 30%",
  overlay = 0.72,
}: {
  image: SiteImage;
  position?: string;
  /** Deckkraft der Mokka-Abdeckung 0–1 */
  overlay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -inset-y-[10%] will-change-transform">
        <Image src={image.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
      <div className="absolute inset-0 bg-mocha" style={{ opacity: overlay }} />
    </div>
  );
}
