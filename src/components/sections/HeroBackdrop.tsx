"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { SiteImage } from "@/content/images";

/**
 * Vollflächiger Foto-Hintergrund des Heros: ab Tablet drei Hochformat-Fotos nebeneinander
 * (Triptychon), auf dem Smartphone ein großes Foto. Langsamer Zoom + Parallax beim Scrollen,
 * beides nur per transform. Bei reduzierter Bewegung statisch.
 */
export function HeroBackdrop({ photos }: { photos: SiteImage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-mocha">
      <motion.div style={reduce ? undefined : { y }} className="absolute -inset-x-0 -top-[2%] bottom-[-18%] grid grid-cols-1 gap-px bg-bone/25 will-change-transform md:grid-cols-3">
        {photos.map((p, i) => (
          <div key={p.src} className={`relative overflow-hidden ${i > 0 ? "hidden md:block" : ""}`}>
            <Image
              src={p.src}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 34vw, 100vw"
              className="kenburns object-cover"
              style={{ animationDelay: `${-i * 6}s` }}
            />
          </div>
        ))}
      </motion.div>
      {/* Abdunklung: unten kräftig (Text), oben leicht (Header) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(36_27_23/0.94)_0%,rgb(36_27_23/0.55)_42%,rgb(36_27_23/0.25)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(36_27_23/0.55)_0%,transparent_60%)]" />
    </div>
  );
}
