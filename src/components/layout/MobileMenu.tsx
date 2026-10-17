"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { nav, site } from "@/content/site";

const ease = [0.16, 1, 0.3, 1] as const;

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll sperren, Escape schließt, Fokus bleibt im Menü
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(ref.current?.querySelectorAll<HTMLElement>("a[href]") ?? []);
    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      const els = focusables();
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
      const all = toggle ? [toggle, ...els] : els;
      const first = all[0];
      const last = all[all.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="on-dark fixed inset-0 z-40 flex flex-col justify-between bg-mocha px-6 pb-10 pt-28 text-bone md:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" }}
          transition={{ duration: 0.8, ease }}
        >
          <nav aria-label="Mobile Navigation">
            <ul role="list" className="space-y-2">
              {nav.map((item, i) => (
                <li key={item.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%" }}
                    animate={{ y: 0, transition: { delay: 0.25 + i * 0.08, duration: 0.9, ease } }}
                    exit={{ y: "110%", transition: { duration: 0.3 } }}
                  >
                    <Link href={item.href} onClick={onClose} className="block py-2 font-display text-[3.25rem] font-light leading-[1.05]">
                      {item.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }} exit={{ opacity: 0 }} className="mt-10">
              <Link
                href="/kontakt?thema=erstgespraech"
                onClick={onClose}
                className="inline-flex min-h-12 items-center rounded-full border border-bone/50 px-6 text-[0.75rem] uppercase tracking-[0.2em]"
              >
                Kostenloses Erstgespräch
              </Link>
            </motion.div>
          </nav>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.7 } }} exit={{ opacity: 0 }} className="space-y-1 text-sm text-bone/75">
            <p>
              <a href={`tel:${site.phone.tel}`} className="link-line">
                {site.phone.display}
              </a>
            </p>
            <p>
              {site.address.street}, {site.address.zip} {site.address.city}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
