import nodemailer from "nodemailer";
import type { ContactData } from "./schema";
import { topicLabel } from "./topics";
import { getConfig } from "./config";

/** Kopfzeilen dürfen keine Zeilenumbrüche enthalten (Header-Injection). */
const LINE_BREAKS = new RegExp(`[${String.fromCharCode(13, 10, 0x2028, 0x2029)}]+`, "g");
export const headerSafe = (s: string) => s.replace(LINE_BREAKS, " ").trim().slice(0, 150);

export function buildMessage(data: ContactData, now = new Date()) {
  const topic = topicLabel(data.topic);
  const subject = headerSafe(`Neue Anfrage über jane-hirsch.de: ${topic} – ${data.name}`);
  const lines = [
    `Thema:      ${topic}`,
    `Name:       ${data.name}`,
    `E-Mail:     ${data.email}`,
    data.phone ? `Telefon:    ${data.phone}` : null,
    data.salon ? `Salon:      ${data.salon}` : null,
    "",
    "Nachricht:",
    data.message,
    "",
    "—",
    `Datenschutzhinweise bestätigt am ${now.toISOString()} (UTC).`,
    "Diese Nachricht wurde über das Kontaktformular von jane-hirsch.de erzeugt. Antworten geht direkt an die Absenderadresse.",
  ].filter((l): l is string => l !== null);
  return { subject, text: lines.join("\n") };
}

export type SendResult = { mode: "send" | "dry-run" };

export async function sendContactMail(data: ContactData): Promise<SendResult> {
  const cfg = getConfig();
  if (cfg.mode === "dry-run") return { mode: "dry-run" };

  const transport = nodemailer.createTransport({
    host: cfg.smtp.host,
    port: cfg.smtp.port,
    secure: cfg.smtp.secure,
    requireTLS: !cfg.smtp.secure,
    auth: cfg.smtp.user ? { user: cfg.smtp.user, pass: cfg.smtp.pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  const { subject, text } = buildMessage(data);
  await transport.sendMail({
    to: cfg.to,
    from: cfg.from,
    replyTo: { name: headerSafe(data.name), address: data.email },
    subject,
    text,
  });
  return { mode: "send" };
}
