import type { Service } from "@/content/services";

export const VAT_RATE = 0.19;

export type Quote = { quantity: number; netCents: number; vatCents: number; grossCents: number; unitGrossCents: number };

/** Preise werden ausschließlich serverseitig aus dem Inhalt berechnet – nie aus Clientangaben. */
export function quote(booking: NonNullable<Service["booking"]>, quantity: number): Quote {
  const unitGross = Math.round(booking.netCents * (1 + VAT_RATE));
  const net = booking.netCents * quantity;
  const gross = unitGross * quantity;
  return { quantity, netCents: net, vatCents: gross - net, grossCents: gross, unitGrossCents: unitGross };
}

export const euro = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);

export type CartItem = { slug: string; quantity: number };
export type CartLine = { slug: string; title: string; unit: string; quantity: number; netCents: number; unitNetCents: number } & Quote;
export type CartQuote = { lines: CartLine[]; netCents: number; vatCents: number; grossCents: number };

export const MAX_CART_LINES = 6;

/**
 * Berechnet den ganzen Warenkorb aus den Inhalten (Services). Unbekannte/nicht buchbare Angebote
 * und Mengen über dem Maximum ergeben `null` – dann wird nichts berechnet.
 */
export function quoteCart(items: CartItem[], lookup: (slug: string) => Pick<Service, "title" | "booking"> | undefined): CartQuote | null {
  if (items.length === 0 || items.length > MAX_CART_LINES) return null;
  const seen = new Set<string>();
  const lines: CartLine[] = [];
  for (const it of items) {
    const s = lookup(it.slug);
    if (!s?.booking || seen.has(it.slug)) return null;
    if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > s.booking.maxQuantity) return null;
    seen.add(it.slug);
    const q = quote(s.booking, it.quantity);
    lines.push({ slug: it.slug, title: s.title, unit: s.booking.unit, unitNetCents: s.booking.netCents, ...q });
  }
  const net = lines.reduce((a, l) => a + l.netCents, 0);
  const gross = lines.reduce((a, l) => a + l.grossCents, 0);
  return { lines, netCents: net, vatCents: gross - net, grossCents: gross };
}
