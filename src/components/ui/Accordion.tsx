"use client";

import { useId, useState } from "react";
import type { Faq } from "@/content/services";

/** Barrierearmes Akkordeon (Button + Region), animiert über CSS-Grid ohne Layout-Sprünge. */
export function Accordion({ items, tone = "light" }: { items: Faq[]; tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className={`divide-y border-y hairline ${tone === "dark" ? "on-dark" : ""}`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-b${i}`;
        const panelId = `${uid}-p${i}`;
        return (
          <div key={it.q}>
            <h3 className="!font-sans !text-base !font-normal !tracking-normal">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left transition-colors hover:text-rose-deep focus-visible:outline-offset-[-3px] md:py-7"
              >
                <span className="font-display text-xl leading-snug md:text-[1.6rem]">{it.q}</span>
                <span aria-hidden="true" className="relative mt-2 h-4 w-4 shrink-0">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                  <span className={`absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-500 ${isOpen ? "scale-y-0" : ""}`} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-7 text-muted">{it.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
