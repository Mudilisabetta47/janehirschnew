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
