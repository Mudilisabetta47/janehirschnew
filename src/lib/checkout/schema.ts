import { z } from "zod";
import { services } from "@/content/services";

const bookable = services.filter((s) => s.booking).map((s) => s.slug) as [string, ...string[]];

/** Steuerzeichen entfernen + trimmen (Namen/Adresse landen auf Rechnungen und in E-Mails). */
const clean = (s: string) => s.replace(/[\u0000-\u001F\u007F]/g, "").trim();
const text = (min: number, max: number, minMsg: string) =>
  z
    .string({ error: minMsg })
    .transform(clean)
    .pipe(z.string().min(min, minMsg).max(max, "Der Text ist zu lang."));
const optional = (max: number) =>
  z
    .string()
    .optional()
    .transform((v) => clean(v ?? ""))
    .pipe(z.string().max(max, "Der Text ist zu lang."));

/** Gemeinsames Schema für das Buchungsformular (Browser) und den Server. Preise kommen nie vom Client. */
export const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.enum(bookable, { error: "Dieses Angebot ist nicht online buchbar." }),
        quantity: z.number({ error: "Bitte gib eine Anzahl an." }).int("Bitte gib eine ganze Zahl an.").min(1, "Mindestens 1.").max(20, "Zu viele."),
      }),
      { error: "Dein Warenkorb ist leer." },
    )
    .min(1, "Dein Warenkorb ist leer.")
    .max(6, "Zu viele Positionen."),
  firstName: text(2, 60, "Bitte gib deinen Vornamen an."),
  lastName: text(2, 60, "Bitte gib deinen Nachnamen an."),
  company: optional(100),
  street: text(3, 100, "Bitte gib Straße und Hausnummer an."),
  zip: z
    .string({ error: "Bitte gib die Postleitzahl an." })
    .transform(clean)
    .pipe(z.string().regex(/^\d{5}$/, "Bitte gib eine gültige 5-stellige Postleitzahl an.")),
  city: text(2, 60, "Bitte gib den Ort an."),
  email: z
    .string({ error: "Bitte gib deine E-Mail-Adresse an." })
    .transform((v) => clean(v).toLowerCase())
    .pipe(z.string().min(1, "Bitte gib deine E-Mail-Adresse an.").max(200).email("Bitte gib eine gültige E-Mail-Adresse an.")),
  phone: optional(40).pipe(z.string().regex(/^[0-9+()\/\-\s.]*$/, "Bitte nutze nur Ziffern, Leerzeichen und + ( ) / -")),
  vatId: optional(20).pipe(z.string().regex(/^(DE\d{9})?$/i, "Bitte gib eine deutsche USt-IdNr. an (DE + 9 Ziffern) oder lass das Feld leer.")),
  wish: optional(200),
  accepted: z.literal(true, { error: "Bitte bestätige die AGB." }),
  /** Honeypot – muss leer bleiben */
  website: z.string().max(0).optional().default(""),
  /** Signiertes Zeit-Token (/api/contact/token) */
  token: z.string({ error: "Sicherheitsprüfung fehlgeschlagen." }).min(10).max(300),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutData = z.output<typeof checkoutSchema>;
export type CheckoutFieldErrors = Partial<Record<keyof CheckoutInput, string>>;

export function flattenCheckoutErrors(error: z.ZodError): CheckoutFieldErrors {
  const out: CheckoutFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof CheckoutInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
