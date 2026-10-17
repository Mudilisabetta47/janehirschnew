import nodemailer from "nodemailer";
import type Stripe from "stripe";
import { getConfig } from "@/lib/contact/config";
import { headerSafe } from "@/lib/contact/mail";
import { euro } from "./pricing";

/** Benachrichtigung an Jane Hirsch nach erfolgreicher Zahlung (nur Plaintext, keine Kartendaten). */
export function buildBookingMessage(session: Stripe.Checkout.Session) {
  const md = session.metadata ?? {};
  const cd = session.customer_details;
  const addr = cd?.address;
  const wunsch = session.custom_fields?.find((f) => f.key === "wunschzeitraum")?.text?.value;
  const subject = headerSafe(`Neue bezahlte Buchung: ${md.slug ?? "Coaching"} – ${cd?.name ?? "Kunde"}`);
  const lines = [
    `Angebot:       ${md.slug ?? "?"}  (Anzahl: ${md.quantity ?? "?"})`,
    `Betrag brutto: ${euro(session.amount_total ?? 0)}  (netto ${euro(Number(md.net_cents ?? 0))}, MwSt. ${euro(Number(md.vat_cents ?? 0))})`,
    `Zahlstatus:    ${session.payment_status}`,
    "",
    `Name:          ${cd?.name ?? ""}`,
    `E-Mail:        ${cd?.email ?? ""}`,
    cd?.phone ? `Telefon:       ${cd.phone}` : null,
    addr ? `Anschrift:     ${[addr.line1, addr.line2, [addr.postal_code, addr.city].filter(Boolean).join(" "), addr.country].filter(Boolean).join(", ")}` : null,
    cd?.tax_ids?.length ? `USt-IdNr.:     ${cd.tax_ids.map((t) => t.value).join(", ")}` : null,
    wunsch ? `Wunschzeitraum: ${wunsch}` : null,
    "",
    `Stripe-Sitzung: ${session.id}`,
    "Die Rechnung wird von Stripe erzeugt und per E-Mail an den Kunden gesendet (Dashboard prüfen).",
  ].filter((l): l is string => l !== null);
  return { subject, text: lines.join("\n") };
}

export async function sendBookingMail(session: Stripe.Checkout.Session): Promise<"send" | "dry-run"> {
  const cfg = getConfig();
  if (cfg.mode === "dry-run") return "dry-run";
  const transport = nodemailer.createTransport({
    host: cfg.smtp.host,
    port: cfg.smtp.port,
    secure: cfg.smtp.secure,
    requireTLS: !cfg.smtp.secure,
    auth: cfg.smtp.user ? { user: cfg.smtp.user, pass: cfg.smtp.pass } : undefined,
    connectionTimeout: 10_000,
    socketTimeout: 15_000,
  });
  const { subject, text } = buildBookingMessage(session);
  const email = session.customer_details?.email;
  await transport.sendMail({ to: cfg.to, from: cfg.from, replyTo: email ? { address: email } : undefined, subject, text });
  return "send";
}
