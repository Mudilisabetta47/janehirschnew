import type Stripe from "stripe";
import { getService } from "@/content/services";
import { all, batch, nowIso, one, run } from "./db";

/* ---------- Typen & Beschriftungen (client-sicher in ./labels) ---------- */
import { inquiryStatuses, inquiryStatusLabel, orderStatuses, orderStatusLabel, paymentLabel } from "./labels";
import type { InquiryStatus, MailState, OrderStatus, PaymentStatus } from "./labels";
export * from "./labels";

export type Inquiry = {
  id: number; created_at: string; updated_at: string; name: string; email: string; phone: string; salon: string;
  topic: string; message: string; consent_at: string; status: InquiryStatus; notes: string; mail_state: MailState; answered_at: string | null;
};
export type OrderLine = { slug: string; title: string; quantity: number; netCents: number };
export type Order = {
  id: number; created_at: string; updated_at: string; paid_at: string | null; stripe_session_id: string; payment_intent: string; livemode: number;
  payment_status: PaymentStatus; items: string; net_cents: number; vat_cents: number; gross_cents: number; name: string; company: string; email: string;
  phone: string; street: string; zip: string; city: string; vat_id: string; wish: string; status: OrderStatus; notes: string; mail_state: MailState;
};
export type Activity = { id: number; at: string; entity: string; entity_id: number; text: string };

const isOneOf = <T extends readonly string[]>(list: T, v: unknown): v is T[number] => typeof v === "string" && (list as readonly string[]).includes(v);

/* ---------- Aktivitätsprotokoll ---------- */
export async function addActivity(entity: "inquiry" | "order", id: number, text: string): Promise<void> {
  await run("INSERT INTO activity (at, entity, entity_id, text) VALUES (?, ?, ?, ?)", [nowIso(), entity, id, text.slice(0, 500)]);
}
export function listActivity(entity: "inquiry" | "order", id: number): Promise<Activity[]> {
  return all<Activity>("SELECT * FROM activity WHERE entity = ? AND entity_id = ? ORDER BY id DESC LIMIT 100", [entity, id]);
}

/* ---------- Anfragen ---------- */
export type NewInquiry = { name: string; email: string; phone: string; salon: string; topic: string; message: string };

export async function insertInquiry(d: NewInquiry, mailState: MailState = "offen"): Promise<number> {
  const t = nowIso();
  const r = await run(
    "INSERT INTO inquiries (created_at, updated_at, name, email, phone, salon, topic, message, consent_at, mail_state) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [t, t, d.name, d.email, d.phone, d.salon, d.topic, d.message, t, mailState],
  );
  await addActivity("inquiry", r.lastId, "Anfrage über das Formular eingegangen");
  return r.lastId;
}

export async function setInquiryMailState(id: number, state: MailState): Promise<void> {
  await run("UPDATE inquiries SET mail_state = ?, updated_at = ? WHERE id = ?", [state, nowIso(), id]);
}

export function listInquiries(opts: { status?: string; q?: string; limit?: number } = {}): Promise<Inquiry[]> {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (isOneOf(inquiryStatuses, opts.status)) {
    where.push("status = ?");
    args.push(opts.status);
  }
  if (opts.q?.trim()) {
    where.push("(name LIKE ? OR email LIKE ? OR message LIKE ? OR salon LIKE ?)");
    const like = `%${opts.q.trim().replace(/[%_]/g, "")}%`;
    args.push(like, like, like, like);
  }
  const sql = `SELECT * FROM inquiries ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT ?`;
  return all<Inquiry>(sql, [...args, opts.limit ?? 200]);
}

export const getInquiry = (id: number) => one<Inquiry>("SELECT * FROM inquiries WHERE id = ?", [id]);

export async function updateInquiry(id: number, patch: { status?: string; notes?: string }): Promise<boolean> {
  const cur = await getInquiry(id);
  if (!cur) return false;
  const status = isOneOf(inquiryStatuses, patch.status) ? patch.status : cur.status;
  const notes = patch.notes !== undefined ? patch.notes.slice(0, 5000) : cur.notes;
  const answeredAt = status === "beantwortet" && !cur.answered_at ? nowIso() : cur.answered_at;
  await run("UPDATE inquiries SET status = ?, notes = ?, answered_at = ?, updated_at = ? WHERE id = ?", [status, notes, answeredAt, nowIso(), id]);
  if (status !== cur.status) await addActivity("inquiry", id, `Status: ${inquiryStatusLabel[cur.status]} → ${inquiryStatusLabel[status]}`);
  if (notes !== cur.notes) await addActivity("inquiry", id, "Notiz geändert");
  return true;
}

export async function deleteInquiry(id: number): Promise<boolean> {
  const before = await getInquiry(id);
  await batch([
    { sql: "DELETE FROM inquiries WHERE id = ?", args: [id] },
    { sql: "DELETE FROM activity WHERE entity = 'inquiry' AND entity_id = ?", args: [id] },
  ]);
  return Boolean(before);
}

/** Löscht erledigte/Spam-Anfragen nach Ablauf der Aufbewahrungsfrist (Datensparsamkeit). */
export async function purgeInquiries(olderThanDays: number): Promise<number> {
  const cutoff = new Date(Date.now() - olderThanDays * 86_400_000).toISOString();
  const ids = await all<{ id: number }>("SELECT id FROM inquiries WHERE status IN ('erledigt','spam') AND updated_at < ?", [cutoff]);
  for (const { id } of ids) await deleteInquiry(id);
  return ids.length;
}

/* ---------- Bestellungen ---------- */
/** Metadaten-Text „slug:menge,slug:menge“ → Positionen mit Titel und Nettopreis (aus den Inhalten). */
export function parseItems(meta: string | undefined): OrderLine[] {
  return (meta ?? "")
    .split(",")
    .map((p) => p.split(":"))
    .filter((p): p is [string, string] => p.length === 2 && !!p[0])
    .map(([slug, qty]) => {
      const s = getService(slug);
      return { slug, title: s?.title ?? slug, quantity: Number(qty) || 1, netCents: (s?.booking?.netCents ?? 0) * (Number(qty) || 1) };
    });
}

/** Legt eine Bestellung aus einer Stripe-Sitzung an (idempotent über die Sitzungs-ID) bzw. aktualisiert den Zahlstatus. */
export async function upsertOrderFromSession(session: Stripe.Checkout.Session): Promise<{ id: number; created: boolean; becamePaid: boolean }> {
  const md = session.metadata ?? {};
  const cd = session.customer_details;
  const a = cd?.address;
  const pay: PaymentStatus = session.payment_status === "paid" ? "paid" : session.payment_status === "unpaid" ? "pending" : "paid";
  const t = nowIso();
  const pi = typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? "");
  const existing = await one<{ id: number; payment_status: PaymentStatus }>("SELECT id, payment_status FROM orders WHERE stripe_session_id = ?", [session.id]);
  if (existing) {
    if (existing.payment_status !== pay && existing.payment_status !== "refunded") {
      await run("UPDATE orders SET payment_status = ?, paid_at = COALESCE(paid_at, ?), payment_intent = CASE WHEN payment_intent = '' THEN ? ELSE payment_intent END, updated_at = ? WHERE id = ?", [
        pay,
        pay === "paid" ? t : null,
        pi,
        t,
        existing.id,
      ]);
      await addActivity("order", existing.id, `Zahlung: ${paymentLabel[pay]}`);
      return { id: existing.id, created: false, becamePaid: pay === "paid" };
    }
    return { id: existing.id, created: false, becamePaid: false };
  }
  const r = await run(
    `INSERT INTO orders (created_at, updated_at, paid_at, stripe_session_id, payment_intent, livemode, payment_status, items, net_cents, vat_cents, gross_cents,
        name, company, email, phone, street, zip, city, vat_id, wish)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      t, t, pay === "paid" ? t : null, session.id, pi, session.livemode ? 1 : 0, pay, JSON.stringify(parseItems(md.items)),
      Number(md.net_cents ?? 0), Number(md.vat_cents ?? 0), session.amount_total ?? Number(md.net_cents ?? 0) + Number(md.vat_cents ?? 0),
      md.name ?? cd?.name ?? "", md.company ?? "", cd?.email ?? "", cd?.phone ?? "",
      a?.line1 ?? "", a?.postal_code ?? "", a?.city ?? "", md.vat_id ?? "", md.wish ?? "",
    ],
  );
  await addActivity("order", r.lastId, `Bestellung eingegangen (${paymentLabel[pay]})`);
  return { id: r.lastId, created: true, becamePaid: pay === "paid" };
}

export async function setOrderPaymentByIntent(paymentIntent: string, status: PaymentStatus): Promise<number | null> {
  if (!paymentIntent) return null;
  const row = await one<{ id: number }>("SELECT id FROM orders WHERE payment_intent = ?", [paymentIntent]);
  if (!row) return null;
  await run("UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?", [status, nowIso(), row.id]);
  await addActivity("order", row.id, `Zahlung: ${paymentLabel[status]}`);
  return row.id;
}

export async function setOrderPaymentBySession(sessionId: string, status: PaymentStatus): Promise<number | null> {
  const row = await one<{ id: number }>("SELECT id FROM orders WHERE stripe_session_id = ?", [sessionId]);
  if (!row) return null;
  await run("UPDATE orders SET payment_status = ?, updated_at = ? WHERE id = ?", [status, nowIso(), row.id]);
  await addActivity("order", row.id, `Zahlung: ${paymentLabel[status]}`);
  return row.id;
}

export async function setOrderMailState(id: number, state: MailState): Promise<void> {
  await run("UPDATE orders SET mail_state = ?, updated_at = ? WHERE id = ?", [state, nowIso(), id]);
}

export function listOrders(opts: { status?: string; q?: string; limit?: number } = {}): Promise<Order[]> {
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (isOneOf(orderStatuses, opts.status)) {
    where.push("status = ?");
    args.push(opts.status);
  }
  if (opts.q?.trim()) {
    where.push("(name LIKE ? OR email LIKE ? OR company LIKE ? OR items LIKE ?)");
    const like = `%${opts.q.trim().replace(/[%_]/g, "")}%`;
    args.push(like, like, like, like);
  }
  const sql = `SELECT * FROM orders ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY id DESC LIMIT ?`;
  return all<Order>(sql, [...args, opts.limit ?? 200]);
}

export const getOrder = (id: number) => one<Order>("SELECT * FROM orders WHERE id = ?", [id]);

export async function updateOrder(id: number, patch: { status?: string; notes?: string }): Promise<boolean> {
  const cur = await getOrder(id);
  if (!cur) return false;
  const status = isOneOf(orderStatuses, patch.status) ? patch.status : cur.status;
  const notes = patch.notes !== undefined ? patch.notes.slice(0, 5000) : cur.notes;
  await run("UPDATE orders SET status = ?, notes = ?, updated_at = ? WHERE id = ?", [status, notes, nowIso(), id]);
  if (status !== cur.status) await addActivity("order", id, `Status: ${orderStatusLabel[cur.status]} → ${orderStatusLabel[status]}`);
  if (notes !== cur.notes) await addActivity("order", id, "Notiz geändert");
  return true;
}

export const parseOrderItems = (o: Pick<Order, "items">): OrderLine[] => {
  try {
    const v = JSON.parse(o.items);
    return Array.isArray(v) ? (v as OrderLine[]) : [];
  } catch {
    return [];
  }
};

/* ---------- Kennzahlen ---------- */
export async function stats() {
  const n = async (sql: string, args: (string | number)[] = []) => (await one<{ n: number }>(sql, args))?.n ?? 0;
  const monthStart = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
  const [newInquiries, openInquiries, totalInquiries, newOrders, totalOrders, revenueMonthNet, revenueTotalNet] = await Promise.all([
    n("SELECT COUNT(*) AS n FROM inquiries WHERE status = 'neu'"),
    n("SELECT COUNT(*) AS n FROM inquiries WHERE status IN ('neu','in_arbeit')"),
    n("SELECT COUNT(*) AS n FROM inquiries"),
    n("SELECT COUNT(*) AS n FROM orders WHERE status = 'neu' AND payment_status = 'paid'"),
    n("SELECT COUNT(*) AS n FROM orders"),
    n("SELECT COALESCE(SUM(net_cents),0) AS n FROM orders WHERE payment_status = 'paid' AND status != 'storniert' AND created_at >= ?", [monthStart]),
    n("SELECT COALESCE(SUM(net_cents),0) AS n FROM orders WHERE payment_status = 'paid' AND status != 'storniert'"),
  ]);
  return { newInquiries, openInquiries, totalInquiries, newOrders, totalOrders, revenueMonthNet, revenueTotalNet };
}
