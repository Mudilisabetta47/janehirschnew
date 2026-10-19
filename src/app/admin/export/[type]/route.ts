import { isAdmin } from "@/lib/admin/auth";
import { fmtDate, toCsv } from "@/lib/admin/format";
import { listInquiries, listOrders, parseOrderItems, inquiryStatusLabel, orderStatusLabel, paymentLabel } from "@/lib/db/repo";
import { topicLabel } from "@/lib/contact/topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** CSV-Export (Excel: Semikolon, UTF-8 mit BOM). Nur mit gültiger Backend-Sitzung. */
export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  if (!(await isAdmin())) return new Response("Nicht angemeldet", { status: 401, headers: { "Cache-Control": "no-store" } });
  const { type } = await params;
  let rows: unknown[][];
  if (type === "anfragen") {
    rows = [
      ["ID", "Eingang", "Name", "E-Mail", "Telefon", "Salon", "Thema", "Nachricht", "Status", "Notiz", "Mail"],
      ...(await listInquiries({ limit: 5000 })).map((i) => [i.id, fmtDate(i.created_at), i.name, i.email, i.phone, i.salon, topicLabel(i.topic), i.message, inquiryStatusLabel[i.status], i.notes, i.mail_state]),
    ];
  } else if (type === "bestellungen") {
    rows = [
      ["ID", "Datum", "Name", "Firma", "E-Mail", "Telefon", "Straße", "PLZ", "Ort", "USt-IdNr.", "Positionen", "Netto €", "MwSt. €", "Brutto €", "Zahlung", "Status", "Wunschzeitraum", "Notiz"],
      ...(await listOrders({ limit: 5000 })).map((o) => [
        o.id, fmtDate(o.created_at), o.name, o.company, o.email, o.phone, o.street, o.zip, o.city, o.vat_id,
        parseOrderItems(o).map((l) => `${l.quantity}x ${l.title}`).join(" | "),
        (o.net_cents / 100).toFixed(2).replace(".", ","), (o.vat_cents / 100).toFixed(2).replace(".", ","), (o.gross_cents / 100).toFixed(2).replace(".", ","),
        paymentLabel[o.payment_status], orderStatusLabel[o.status], o.wish, o.notes,
      ]),
    ];
  } else {
    return new Response("Unbekannter Export", { status: 404 });
  }
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
