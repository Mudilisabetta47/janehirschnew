"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { euro, quote, VAT_RATE } from "@/lib/checkout/pricing";
import type { Service } from "@/content/services";

type Props = { slug: string; title: string; booking: NonNullable<Service["booking"]> };

/** Direkt buchen & bezahlen (Stripe Checkout). Preise werden hier nur angezeigt; maßgeblich ist die Serverberechnung. */
export function BookingPanel({ slug, title, booking }: Props) {
  const uid = useId();
  const cancelled = useSearchParams().get("zahlung") === "abgebrochen";
  const [quantity, setQuantity] = useState(1);
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(cancelled ? "Die Zahlung wurde abgebrochen – es wurde nichts abgebucht." : "");
  const q = quote(booking, quantity);

  async function pay() {
    if (!accepted) return setError("Bitte bestätige die AGB.");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, quantity, accepted }),
      });
      const json = (await res.json()) as { ok: boolean; url?: string; message?: string };
      if (json.ok && json.url) {
        window.location.assign(json.url);
        return;
      }
      setError(json.message ?? "Die Zahlung konnte nicht gestartet werden.");
    } catch {
      setError("Keine Verbindung. Bitte versuche es erneut oder nutze die Anfrage.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow mb-5">Direkt buchen</p>
        <h2 id="buchen-title" className="display-m mb-6">
          {title} online buchen
        </h2>
        <p className="lead">
          Sicher bezahlen über Stripe (Karte, SEPA u. a. je nach Freischaltung). Die Rechnung kommt automatisch per E-Mail. Den Termin stimmen wir danach persönlich ab.
        </p>
      </div>

      <div className="lg:col-span-6 lg:col-start-7">
        <dl className="divide-y divide-ink/15 border-y border-ink/15">
          <div className="flex justify-between gap-4 py-4">
            <dt>
              {euro(booking.netCents)} netto je {booking.unit}
            </dt>
            <dd className="font-display text-2xl">{euro(q.netCents)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-4">
            <dt>zzgl. {Math.round(VAT_RATE * 100)} % MwSt.</dt>
            <dd>{euro(q.vatCents)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-4">
            <dt className="font-medium">Gesamt (brutto)</dt>
            <dd className="font-display text-3xl">{euro(q.grossCents)}</dd>
          </div>
        </dl>

        {booking.maxQuantity > 1 && (
          <div className="mt-6">
            <label htmlFor={`${uid}-q`} className="block text-[0.72rem] font-medium uppercase tracking-[0.22em]">
              Anzahl ({booking.unit})
            </label>
            <select
              id={`${uid}-q`}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2 w-40 cursor-pointer border-0 border-b border-ink/30 bg-transparent py-3 text-base focus:border-rose-deep focus:outline-none focus:ring-0"
            >
              {Array.from({ length: booking.maxQuantity }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-8 flex items-start gap-4">
          <input id={`${uid}-agb`} type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1.5 h-5 w-5 shrink-0 cursor-pointer accent-[#8a5a48]" />
          <label htmlFor={`${uid}-agb`} className="cursor-pointer text-[0.95rem] leading-relaxed">
            Ich habe die{" "}
            <Link href="/agb" target="_blank" className="link-line">
              AGB
            </Link>{" "}
            gelesen und akzeptiere sie. Das Angebot richtet sich an Unternehmer und Gewerbetreibende.
          </label>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="button" onClick={pay} disabled={busy}>
            {busy ? "Weiter zur Zahlung …" : "Jetzt buchen & bezahlen"}
          </Button>
          <Link href={`/kontakt?thema=${slug}#anfrage`} className="link-line text-sm">
            Lieber Rechnung oder Ratenzahlung? Zur Anfrage
          </Link>
        </div>
        <p className="mt-5 text-sm text-muted">Eventuelle Fahrtkosten werden – falls zutreffend – separat abgestimmt.</p>
        <div aria-live="assertive">
          {error && (
            <p role="alert" className="mt-5 border-l-2 border-[#9b2c1f] py-1 pl-4 text-[#9b2c1f]">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
