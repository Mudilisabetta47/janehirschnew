import "@/lib/zodConfig";
import { z } from "zod";
import { topicValues } from "./topics";

/** Entfernt Steuerzeichen (außer Zeilenumbruch/Tab in Freitext) und trimmt. */
const clean = (s: string, multiline = false) =>
  s.replace(multiline ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "").trim();

const text = (min: number, max: number, minMsg: string, maxMsg: string, multiline = false) =>
  z
    .string({ error: minMsg })
    .transform((v) => clean(v, multiline))
    .pipe(z.string().min(min, minMsg).max(max, maxMsg));

const optionalText = (max: number, maxMsg: string) =>
  z
    .string()
    .optional()
    .transform((v) => clean(v ?? ""))
    .pipe(z.string().max(max, maxMsg));

/** Gemeinsames Schema für Client (Sofort-Feedback) und Server (maßgebliche Prüfung). */
export const contactSchema = z.object({
  name: text(2, 100, "Bitte gib deinen Namen an.", "Der Name ist zu lang."),
  email: z
    .string({ error: "Bitte gib deine E-Mail-Adresse an." })
    .transform((v) => clean(v).toLowerCase())
    .pipe(
      z
        .string()
        .min(1, "Bitte gib deine E-Mail-Adresse an.")
        .max(200, "Die E-Mail-Adresse ist zu lang.")
        .email("Bitte gib eine gültige E-Mail-Adresse an."),
    ),
  phone: optionalText(40, "Die Telefonnummer ist zu lang.").pipe(
    z.string().regex(/^[0-9+()\/\-\s.]*$/, "Bitte nutze nur Ziffern, Leerzeichen und + ( ) / -"),
  ),
  salon: optionalText(120, "Der Salonname ist zu lang."),
  topic: z.enum(topicValues, { error: "Bitte wähle ein Thema." }),
  message: text(10, 4000, "Bitte schreib mir kurz, worum es geht (mind. 10 Zeichen).", "Die Nachricht ist zu lang (max. 4.000 Zeichen).", true),
  consent: z.literal(true, { error: "Bitte bestätige die Datenschutzhinweise." }),
  /** Honeypot – muss leer bleiben. Für Menschen unsichtbar. */
  website: z.string().max(0).optional().default(""),
  /** Signiertes Zeit-Token von GET /api/contact/token */
  token: z.string({ error: "Sicherheitsprüfung fehlgeschlagen." }).min(10).max(300),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ContactInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
