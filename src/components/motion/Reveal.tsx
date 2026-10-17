"use client";

import { motion, type HTMLMotionProps } from "motion/react";

type Props = HTMLMotionProps<"div"> & { delay?: number; y?: number; as?: "div" | "li" | "section" | "article" };

const ease = [0.16, 1, 0.3, 1] as const;

/** Sanftes Einblenden beim Scrollen (einmalig). */
export function Reveal({ delay = 0, y = 28, className = "", children, as = "div", ...rest }: Props) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={`reveal ${className}`}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const container = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

/** Gestaffelte Kinder: <Stagger><StaggerItem/>…</Stagger> */
export function Stagger({
  stagger = 0.09,
  className = "",
  children,
  as = "div",
}: {
  stagger?: number;
  className?: string;
  children: React.ReactNode;
  as?: "div" | "ul" | "ol";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      {...(as !== "div" ? { role: "list" } : {})}
    >
      {children}
    </Tag>
  );
}

export function StaggerItem({
  className = "",
  children,
  as = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "li";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={`reveal ${className}`} variants={item}>
      {children}
    </Tag>
  );
}
