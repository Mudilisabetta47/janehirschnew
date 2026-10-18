import Link from "next/link";
import type { InquiryStatus, OrderStatus, PaymentStatus } from "@/lib/db/labels";
import { inquiryStatusLabel, orderStatusLabel, paymentLabel } from "@/lib/db/labels";

const tone: Record<string, string> = {
  neu: "bg-[#f3d9a8] text-ink",
  in_arbeit: "bg-[#d9e4f3] text-ink",
  beantwortet: "bg-[#dfeedd] text-ink",
  erledigt: "bg-ink/10 text-ink/70",
  spam: "bg-[#f0d6d3] text-ink/80",
  termin_abgestimmt: "bg-[#dfeedd] text-ink",
  durchgefuehrt: "bg-ink/10 text-ink/70",
  storniert: "bg-[#f0d6d3] text-ink/80",
  paid: "bg-[#dfeedd] text-ink",
  pending: "bg-[#f3d9a8] text-ink",
  failed: "bg-[#f0d6d3] text-ink",
  refunded: "bg-[#f0d6d3] text-ink",
};

export function Badge({ kind, value }: { kind: "inquiry" | "order" | "payment"; value: string }) {
  const label = kind === "inquiry" ? inquiryStatusLabel[value as InquiryStatus] : kind === "order" ? orderStatusLabel[value as OrderStatus] : paymentLabel[value as PaymentStatus];
  return <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-[0.72rem] font-medium uppercase tracking-[0.12em] ${tone[value] ?? "bg-ink/10"}`}>{label ?? value}</span>;
}

export function Card({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`border border-ink/15 bg-white/60 p-6 ${className}`}>
      {title && <h2 className="mb-4 font-sans text-[0.72rem] font-medium uppercase tracking-[0.22em] text-rose-deep">{title}</h2>}
      {children}
    </section>
  );
}

export function Stat({ label, value, href, hint }: { label: string; value: string | number; href?: string; hint?: string }) {
  const inner = (
    <>
      <p className="text-[0.72rem] uppercase tracking-[0.2em] text-muted">{label}</p>
      <p className="mt-2 font-display text-5xl font-light">{value}</p>
      {hint && <p className="mt-1 text-sm text-muted">{hint}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="block border border-ink/15 bg-white/60 p-6 transition-colors hover:bg-blush">
      {inner}
    </Link>
  ) : (
    <div className="border border-ink/15 bg-white/60 p-6">{inner}</div>
  );
}

export const inputCls = "w-full border border-ink/25 bg-white px-3 py-2.5 text-base focus:border-rose-deep focus:outline-none focus:ring-0";
export const btnCls = "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] text-bone transition-colors hover:bg-rose-deep";
export const btnGhost = "inline-flex min-h-11 items-center justify-center rounded-full border border-ink/30 px-6 text-[0.78rem] font-medium uppercase tracking-[0.16em] transition-colors hover:bg-ink hover:text-bone";
