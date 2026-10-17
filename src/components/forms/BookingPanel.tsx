"use client";

import { useId, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { euro, quote, VAT_RATE } from "@/lib/checkout/pricing";
import type { Service } from "@/content/services";

type Props = { slug: string; title: string; booking: NonNullable<Service["booking"]> };

/** Preisübersicht auf der Angebotsseite → führt zur eigenen Buchungsseite /buchen/[angebot]. */
export function BookingPanel({ slug, title, booking }: Props) {
  const uid = useId();
  const [quantity, setQuantity] = useState(1);
  const q = quote(booking, quantity);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <p className="eyebrow mb-5">Direkt buchen</p>
        <h2 id="buchen-title" className="display-m mb-6">
          {title} online buchen
        </h2>
        <p className="lead">Auf der nächsten Seite gibst du deine Daten ein und zahlst sicher über Stripe. Die Rechnung kommt per E-Mail, den Termin stimmen wir danach persönlich ab.</p>
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

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ButtonLink href={`/buchen/${slug}?anzahl=${quantity}`}>Jetzt buchen</ButtonLink>
          <ButtonLink href={`/kontakt?thema=${slug}#anfrage`} variant="outline" arrow={false}>
            Lieber Anfrage / Raten
          </ButtonLink>
        </div>
        <p className="mt-5 text-sm text-muted">Das Angebot richtet sich an Unternehmer und Gewerbetreibende. Eventuelle Fahrtkosten werden – falls zutreffend – separat abgestimmt.</p>
      </div>
    </div>
  );
}
