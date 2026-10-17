"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { euro, quote, VAT_RATE } from "@/lib/checkout/pricing";
import { checkoutSchema, flattenCheckoutErrors, type CheckoutFieldErrors } from "@/lib/checkout/schema";
import type { Service } from "@/content/services";

type Props = { slug: string; title: string; teaser: string; booking: NonNullable<Service["booking"]> };
type Api = { ok: true; url: string } | { ok: false; code: string; message: string; fieldErrors?: CheckoutFieldErrors };

const input = "w-full border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-base text-inherit focus:border-rose-deep focus:outline-none focus:ring-0 transition-colors";
const label = "block text-[0.72rem] font-medium uppercase tracking-[0.22em]";

/** Eigene Buchungsseite: Kundendaten (Name, Anschrift) → dann Weiterleitung zur sicheren Zahlung bei Stripe. */
export function CheckoutForm({ slug, title, teaser, booking }: Props) {
  const uid = useId();
  const params = useSearchParams();
  const startQty = Math.min(Math.max(Number(params.get("anzahl")) || 1, 1), booking.maxQuantity);
  const [quantity, setQuantity] = useState(startQty);
  const [errors, setErrors] = useState<CheckoutFieldErrors>({});
  const [globalError, setGlobalError] = useState(params.get("zahlung") === "abgebrochen" ? "Die Zahlung wurde abgebrochen – es wurde nichts abgebucht. Du kannst es jederzeit erneut versuchen." : "");
  const [busy, setBusy] = useState(false);
  const tokenRef = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const q = quote(booking, quantity);

  const loadToken = useCallback(async () => {
    try {
      const res = await fetch("/api/contact/token", { cache: "no-store" });
      const json = (await res.json()) as { token?: string };
      if (json.token) tokenRef.current = json.token;
    } catch {
      /* beim Absenden erneut */
    }
  }, []);
  useEffect(() => {
    void loadToken();
  }, [loadToken]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!tokenRef.current) await loadToken();
    const s = (k: string) => String(fd.get(k) ?? "");
    const payload = {
      slug,
      quantity,
      firstName: s("firstName"),
      lastName: s("lastName"),
      company: s("company"),
      street: s("street"),
      zip: s("zip"),
      city: s("city"),
      email: s("email"),
      phone: s("phone"),
      vatId: s("vatId"),
      wish: s("wish"),
      accepted: fd.get("accepted") === "on",
      website: s("website"),
      token: tokenRef.current,
    };

    const local = checkoutSchema.safeParse(payload);
    if (!local.success) {
      const fe = flattenCheckoutErrors(local.error);
      delete fe.token;
      setErrors(fe);
      setGlobalError("Bitte prüfe die markierten Felder.");
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }

    setErrors({});
    setGlobalError("");
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as Api;
      if (json.ok) {
        window.location.assign(json.url);
        return;
      }
      setErrors(json.fieldErrors ?? {});
      setGlobalError(json.message);
      if (json.code === "token" || json.code === "too-fast") void loadToken();
    } catch {
      setGlobalError("Keine Verbindung. Bitte versuche es erneut oder nutze die Anfrage.");
    }
    setBusy(false);
  }

  const f = (name: keyof CheckoutFieldErrors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${uid}-${name}-err` : undefined,
  });
  const err = (name: keyof CheckoutFieldErrors) =>
    errors[name] ? (
      <p id={`${uid}-${name}-err`} className="mt-2 text-sm text-[#9b2c1f]">
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="grid gap-14 lg:grid-cols-12">
      <form ref={formRef} onSubmit={onSubmit} noValidate aria-label="Buchung" className="lg:col-span-7">
        <fieldset className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <legend className="eyebrow mb-8">1 · Deine Angaben</legend>
          <div>
            <label htmlFor={`${uid}-fn`} className={label}>Vorname *</label>
            <input id={`${uid}-fn`} name="firstName" autoComplete="given-name" maxLength={60} required className={input} {...f("firstName")} />
            {err("firstName")}
          </div>
          <div>
            <label htmlFor={`${uid}-ln`} className={label}>Nachname *</label>
            <input id={`${uid}-ln`} name="lastName" autoComplete="family-name" maxLength={60} required className={input} {...f("lastName")} />
            {err("lastName")}
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${uid}-co`} className={label}>
              Firma / Salon <span className="normal-case tracking-normal opacity-70">(optional, erscheint auf der Rechnung)</span>
            </label>
            <input id={`${uid}-co`} name="company" autoComplete="organization" maxLength={100} className={input} {...f("company")} />
            {err("company")}
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${uid}-st`} className={label}>Straße und Hausnummer *</label>
            <input id={`${uid}-st`} name="street" autoComplete="address-line1" maxLength={100} required className={input} {...f("street")} />
            {err("street")}
          </div>
          <div>
            <label htmlFor={`${uid}-zip`} className={label}>Postleitzahl *</label>
            <input id={`${uid}-zip`} name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} required className={input} {...f("zip")} />
            {err("zip")}
          </div>
          <div>
            <label htmlFor={`${uid}-ci`} className={label}>Ort *</label>
            <input id={`${uid}-ci`} name="city" autoComplete="address-level2" maxLength={60} required className={input} {...f("city")} />
            {err("city")}
          </div>
          <div>
            <label htmlFor={`${uid}-country`} className={label}>Land</label>
            <input id={`${uid}-country`} value="Deutschland" readOnly className={`${input} opacity-70`} />
            <p className="mt-2 text-sm text-muted">Für Buchungen außerhalb Deutschlands bitte die Anfrage nutzen.</p>
          </div>
          <div>
            <label htmlFor={`${uid}-vat`} className={label}>
              USt-IdNr. <span className="normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input id={`${uid}-vat`} name="vatId" maxLength={11} placeholder="DE123456789" className={input} {...f("vatId")} />
            {err("vatId")}
          </div>
          <div>
            <label htmlFor={`${uid}-em`} className={label}>E-Mail-Adresse *</label>
            <input id={`${uid}-em`} name="email" type="email" autoComplete="email" maxLength={200} required className={input} {...f("email")} />
            {err("email")}
          </div>
          <div>
            <label htmlFor={`${uid}-ph`} className={label}>
              Telefon <span className="normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input id={`${uid}-ph`} name="phone" type="tel" autoComplete="tel" maxLength={40} className={input} {...f("phone")} />
            {err("phone")}
          </div>
          <div className="md:col-span-2">
            <label htmlFor={`${uid}-wish`} className={label}>
              Wunschzeitraum / Anmerkung <span className="normal-case tracking-normal opacity-70">(optional)</span>
            </label>
            <input id={`${uid}-wish`} name="wish" maxLength={200} className={input} {...f("wish")} />
            {err("wish")}
          </div>
        </fieldset>

        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="mt-10">
          <p className="eyebrow mb-6">2 · Bestätigen</p>
          <div className="flex items-start gap-4">
            <input id={`${uid}-agb`} name="accepted" type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 cursor-pointer accent-[#8a5a48]" {...f("accepted")} />
            <label htmlFor={`${uid}-agb`} className="cursor-pointer text-[0.95rem] leading-relaxed">
              Ich habe die{" "}
              <Link href="/agb" target="_blank" className="link-line">AGB</Link> und die{" "}
              <Link href="/datenschutz" target="_blank" className="link-line">Datenschutzhinweise</Link>{" "}
              gelesen und akzeptiere sie. Das Angebot richtet sich an Unternehmer und Gewerbetreibende. *
            </label>
          </div>
          {err("accepted")}
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={busy}>
            {busy ? "Weiter zur Zahlung …" : "Weiter zur Zahlung"}
          </Button>
          <Link href={`/kontakt?thema=${slug}#anfrage`} className="link-line text-sm">
            Lieber Rechnung oder Ratenzahlung? Zur Anfrage
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">* Pflichtfelder · Die Zahlung erfolgt auf der sicheren Seite von Stripe – Kartendaten gelangen nie auf diese Website.</p>

        <div aria-live="assertive">
          {globalError && (
            <p role="alert" className="mt-6 border-l-2 border-[#9b2c1f] py-1 pl-4 text-[#9b2c1f]">
              {globalError}
            </p>
          )}
        </div>
      </form>

      <aside aria-label="Deine Bestellung" className="lg:col-span-4 lg:col-start-9">
        <div className="on-dark top-28 bg-mocha p-8 text-bone lg:sticky md:p-10">
          <p className="eyebrow mb-5">Deine Bestellung</p>
          <h2 className="font-display text-4xl font-light leading-tight">{title}</h2>
          <p className="mt-3 text-sm text-bone/80">{teaser}</p>

          {booking.maxQuantity > 1 && (
            <div className="mt-6">
              <label htmlFor={`${uid}-qty`} className="block text-[0.72rem] uppercase tracking-[0.22em] text-rose">
                Anzahl ({booking.unit})
              </label>
              <select
                id={`${uid}-qty`}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mt-2 w-full cursor-pointer border-0 border-b border-bone/40 bg-transparent py-2 text-base text-bone focus:border-rose focus:outline-none focus:ring-0 [&>option]:text-ink"
              >
                {Array.from({ length: booking.maxQuantity }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}

          <dl className="mt-8 divide-y divide-bone/15 border-y border-bone/15 text-[0.95rem]">
            <div className="flex justify-between gap-4 py-3">
              <dt>
                {quantity} × {euro(booking.netCents)} netto
              </dt>
              <dd>{euro(q.netCents)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt>MwSt. {Math.round(VAT_RATE * 100)} %</dt>
              <dd>{euro(q.vatCents)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="font-medium">Gesamt (brutto)</dt>
              <dd className="font-display text-3xl">{euro(q.grossCents)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-bone/70">Eventuelle Fahrtkosten werden – falls zutreffend – separat abgestimmt. Den Termin stimmen wir nach der Buchung persönlich ab.</p>
        </div>
      </aside>
    </div>
  );
}
