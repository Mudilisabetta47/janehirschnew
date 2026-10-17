"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Monogram } from "@/components/ui/Monogram";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Hero-Komposition: Bogenfenster (Arch) mit Licht-Verlauf, feine „Haarstrang“-Linien,
 * rotierendes Textsiegel und zwei Parallax-Ebenen. Nur transform/opacity → performant.
 * Slot für ein freigegebenes Foto: `children` ersetzt die Linien-Zeichnung.
 */
export function HeroArt({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yOuter = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yMain = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const ySeal = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const still = reduce ? { y: 0 } : undefined;

  return (
    <div ref={ref} className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] lg:ml-auto" aria-hidden={children ? undefined : true}>
      {/* äußerer Bogen als feine Linie */}
      <motion.div
        style={still ?? { y: yOuter }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease, delay: 0.2 }}
        className="arch absolute -inset-x-5 -top-5 bottom-8 border border-rose/35"
      />

      {/* Hauptbogen */}
      <motion.div
        style={still ?? { y: yMain }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease, delay: 0.35 }}
        className="arch absolute inset-x-0 top-0 bottom-14 overflow-hidden bg-[radial-gradient(110%_80%_at_50%_0%,#fff4ee_0%,#f1ddd1_48%,#c9a190_100%)]"
      >
        {children ?? (
          <svg viewBox="0 0 400 480" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
            {[
              "M-20 470 C 60 330, 20 210, 150 150 S 330 70, 420 -10",
              "M-20 500 C 90 350, 70 250, 190 200 S 360 130, 430 40",
              "M20 520 C 120 380, 130 300, 230 250 S 390 200, 440 120",
              "M-40 430 C 40 300, 40 170, 130 110 S 280 20, 380 -40",
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#8a5a48"
                strokeOpacity={0.55 - i * 0.08}
                strokeWidth={1.1}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.6, ease, delay: 0.7 + i * 0.18 }}
              />
            ))}
          </svg>
        )}
        {!children && <Monogram className="absolute left-1/2 top-[38%] h-24 w-24 -translate-x-1/2 text-ink/80 md:h-28 md:w-28" />}
      </motion.div>

      {/* Textsiegel */}
      <motion.div
        style={still ?? { y: ySeal }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease, delay: 1 }}
        className="absolute -left-4 bottom-0 h-32 w-32 md:-left-10 md:h-40 md:w-40"
      >
        <svg viewBox="0 0 160 160" className="h-full w-full animate-spin-slow text-bone">
          <defs>
            <path id="seal-circle" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" />
          </defs>
          <circle cx="80" cy="80" r="76" className="fill-mocha" />
          <circle cx="80" cy="80" r="76" fill="none" stroke="currentColor" strokeOpacity="0.25" />
          <text fill="currentColor" fontSize="10.5" style={{ fontFamily: "var(--font-sans)", textTransform: "uppercase" }}>
            <textPath href="#seal-circle" textLength="384" lengthAdjust="spacing">Brautstyling · Coaching · Make-up · Hair ·</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-script text-4xl text-rose">J.H.</span>
      </motion.div>
    </div>
  );
}
