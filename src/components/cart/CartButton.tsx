"use client";

import { motion } from "motion/react";
import { useCart } from "./CartProvider";

/** Warenkorb-Button im Header: Tasche mit Zähler-Badge, der bei jeder Änderung kurz „aufpoppt“. */
export function CartButton({ className = "" }: { className?: string }) {
  const { count, open, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls="cart-drawer"
      aria-label={count === 0 ? "Warenkorb, leer" : `Warenkorb, ${count} ${count === 1 ? "Artikel" : "Artikel"}`}
      className={`group relative grid h-12 w-12 place-items-center rounded-full transition-colors duration-300 hover:bg-current/10 ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[1.6rem] w-[1.6rem] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-rotate-6 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.5 8.5h13l-1 11.2a1.5 1.5 0 0 1-1.5 1.3H8a1.5 1.5 0 0 1-1.5-1.3l-1-11.2Z" />
        <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      </svg>
      <motion.span
        key={count}
        aria-hidden="true"
        initial={{ scale: count === 0 ? 1 : 1.7 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 14 }}
        className={`absolute right-0.5 top-0.5 grid h-[1.15rem] min-w-[1.15rem] place-items-center rounded-full px-1 text-[0.65rem] font-medium leading-none ${
          count === 0 ? "bg-current/0 text-transparent" : "bg-rose text-ink shadow-[0_0_0_2px_rgb(36_27_23/0.0)]"
        }`}
      >
        {count > 0 ? count : ""}
      </motion.span>
    </button>
  );
}
