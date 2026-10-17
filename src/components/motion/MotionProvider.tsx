"use client";

import { MotionConfig } from "motion/react";

/** Respektiert `prefers-reduced-motion`: Transform-/Layout-Animationen werden dann deaktiviert. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
