"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { SiteImage } from "@/content/images";

/**
 * Vollflächiges Hero-Foto. Auf dem Desktop das ganze Querformat-Bild, auf dem Smartphone
 * ein Ausschnitt (`mobilePosition`). Langsamer Zoom + Parallax beim Scrollen, nur per transform;
 * bei reduzierter Bewegung statisch.
 */
export function HeroBackdrop({ image, mobilePosition = "22% 30%" }: { image: SiteImage; mobilePosition?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-mocha">
      <motion.div style={reduce ? undefined : { y }} className="absolute inset-x-0 -top-[2%] bottom-[-16%] will-change-transform">
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="kenburns object-cover [object-position:var(--mobile-pos)] md:[object-position:50%_6%]"
          style={{ "--mobile-pos": mobilePosition } as React.CSSProperties}
        />
      </motion.div>
      {/* Warmer Schleier über dem S/W-Bild + Abdunklung für Textlesbarkeit */}
      <div className="absolute inset-0 bg-rose-deep/25 mix-blend-multiply" />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(36_27_23/0.95)_0%,rgb(36_27_23/0.6)_38%,rgb(36_27_23/0.12)_75%,rgb(36_27_23/0.3)_100%)]" />
    </div>
  );
}
