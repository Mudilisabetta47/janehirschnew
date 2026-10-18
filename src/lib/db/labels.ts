/** Beschriftungen und Typen des Backends – bewusst OHNE Datenbank-Import (auch in Client-Komponenten nutzbar). */
export const inquiryStatuses = ["neu", "in_arbeit", "beantwortet", "erledigt", "spam"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];
export const orderStatuses = ["neu", "termin_abgestimmt", "durchgefuehrt", "storniert"] as const;
export type OrderStatus = (typeof orderStatuses)[number];
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type MailState = "offen" | "gesendet" | "nicht_konfiguriert" | "fehlgeschlagen";

export const inquiryStatusLabel: Record<InquiryStatus, string> = { neu: "Neu", in_arbeit: "In Bearbeitung", beantwortet: "Beantwortet", erledigt: "Erledigt", spam: "Spam" };
export const orderStatusLabel: Record<OrderStatus, string> = { neu: "Neu", termin_abgestimmt: "Termin abgestimmt", durchgefuehrt: "Durchgeführt", storniert: "Storniert" };
export const paymentLabel: Record<PaymentStatus, string> = { pending: "Zahlung offen", paid: "Bezahlt", failed: "Fehlgeschlagen", refunded: "Erstattet" };
