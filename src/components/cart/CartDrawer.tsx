"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { images } from "@/content/images";
import { euro, VAT_RATE } from "@/lib/checkout/pricing";
import { ButtonLink } from "@/components/ui/Button";
import { useCart } from "./CartProvider";

const ease = [0.16, 1, 0.3, 1] as const;

/** Warenkorb-Schublade von rechts: Positionen mit Foto, Mengen, Summen, „Zur Kasse“. */
export function CartDrawer() {
  const { open, setOpen, items, quote, setQuantity, remove } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select,input') ?? []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setOpen(false);
      if (e.key !== "Tab") return;
      const els = focusables();
      const first = els[0];
      const last = els[els.length - 1];
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
      lastFocus.current?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.button
            type="button"
            aria-label="Warenkorb schließen"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-mocha/60 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Warenkorb"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-bone text-ink shadow-[-30px_0_60px_-30px_rgb(0_0_0/0.45)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease }}
          >
            <div className="flex items-center justify-between border-b border-ink/12 px-6 py-5">
              <h2 className="font-display text-3xl font-light">Warenkorb</h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Schließen" className="grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-ink/8">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>

            {items.length === 0 || !quote ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
                <p className="script text-6xl text-rose-deep">Noch leer</p>
                <p className="text-muted">Dein Warenkorb ist leer. Wähle ein Coaching, das zu dir passt.</p>
                <ButtonLink href="/coaching" onClick={() => setOpen(false)}>
                  Coachings ansehen
                </ButtonLink>
              </div>
            ) : (
              <>
                <ul role="list" className="flex-1 divide-y divide-ink/12 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {quote.lines.map((l) => {
                      const img = images.services[l.slug];
                      return (
                        <motion.li key={l.slug} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0, x: 30 }} transition={{ duration: 0.4, ease }} className="grid grid-cols-[5rem_1fr] gap-4 py-5">
                          <div className="relative aspect-[4/5] overflow-hidden bg-blush">
                            {img && <Image src={img.src} alt="" fill sizes="80px" className="object-cover" style={{ objectPosition: img.position ?? "50% 40%" }} />}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <Link href={`/coaching/${l.slug}`} onClick={() => setOpen(false)} className="font-display text-2xl font-light leading-tight hover:italic">
                              {l.title}
                            </Link>
                            <p className="mt-1 text-sm text-muted">
                              {euro(l.unitNetCents)} netto je {l.unit}
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <QtyStepper slug={l.slug} quantity={l.quantity} onChange={setQuantity} />
                              <p className="font-display text-xl">{euro(l.netCents)}</p>
                            </div>
                            <button type="button" onClick={() => remove(l.slug)} className="link-line mt-3 self-start text-[0.78rem] uppercase tracking-[0.18em] text-muted hover:text-ink">
                              Entfernen
                            </button>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-ink/12 bg-blush/60 px-6 pb-6 pt-5">
                  <dl className="space-y-2 text-[0.95rem]">
                    <div className="flex justify-between">
                      <dt>Zwischensumme (netto)</dt>
                      <dd>{euro(quote.netCents)}</dd>
                    </div>
                    <div className="flex justify-between text-muted">
                      <dt>MwSt. {Math.round(VAT_RATE * 100)} %</dt>
                      <dd>{euro(quote.vatCents)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between border-t border-ink/12 pt-3">
                      <dt className="font-medium">Gesamt (brutto)</dt>
                      <dd className="font-display text-3xl">{euro(quote.grossCents)}</dd>
                    </div>
                  </dl>
                  <ButtonLink href="/kasse" onClick={() => setOpen(false)} className="mt-5 w-full">
                    Zur Kasse
                  </ButtonLink>
                  <button type="button" onClick={() => setOpen(false)} className="link-line mx-auto mt-4 block text-sm">
                    Weiter stöbern
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function QtyStepper({ slug, quantity, onChange }: { slug: string; quantity: number; onChange: (slug: string, q: number) => void }) {
  const btn = "grid h-9 w-9 place-items-center rounded-full border border-ink/25 transition-colors hover:bg-ink hover:text-bone disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-current";
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="Anzahl">
      <button type="button" className={btn} aria-label="Weniger" disabled={quantity <= 1} onClick={() => onChange(slug, quantity - 1)}>
        −
      </button>
      <span className="min-w-4 text-center tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button type="button" className={btn} aria-label="Mehr" onClick={() => onChange(slug, quantity + 1)}>
        +
      </button>
    </div>
  );
}
