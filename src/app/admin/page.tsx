import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { readiness } from "@/lib/admin/readiness";
import { fmtDate } from "@/lib/admin/format";
import { storeEnabled } from "@/lib/db/db";
import { listInquiries, listOrders, parseOrderItems, purgeInquiries, stats } from "@/lib/db/repo";
import { euro } from "@/lib/checkout/pricing";
import { topicLabel } from "@/lib/contact/topics";
import { Badge, Card, Stat } from "@/components/admin/ui";

export const metadata = { title: "Übersicht" };
export const dynamic = "force-dynamic";

const RETENTION_DAYS = Number.parseInt(process.env.RETENTION_INQUIRY_DAYS ?? "", 10) || 180;

export default async function AdminHome() {
  await requireAdmin();
  const checks = readiness();
  const open = checks.filter((c) => !c.ok).length;

  if (!storeEnabled()) {
    return (
      <>
        <h1 className="mb-8 font-display text-5xl font-light">Übersicht</h1>
        <Card title="Speicher abgeschaltet">
          <p>Mit <code>STORE_ENABLED=false</code> werden keine Anfragen/Bestellungen gespeichert. Backend-Listen sind leer.</p>
        </Card>
        <Readiness checks={checks} open={open} />
      </>
    );
  }

  const purged = await purgeInquiries(RETENTION_DAYS);
  const [s, inquiries, orders] = await Promise.all([stats(), listInquiries({ limit: 5 }), listOrders({ limit: 5 })]);

  return (
    <>
      <h1 className="mb-8 font-display text-5xl font-light">Übersicht</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Neue Anfragen" value={s.newInquiries} href="/admin/anfragen?status=neu" hint={`${s.openInquiries} offen · ${s.totalInquiries} gesamt`} />
        <Stat label="Neue Bestellungen" value={s.newOrders} href="/admin/bestellungen?status=neu" hint={`${s.totalOrders} gesamt`} />
        <Stat label="Umsatz diesen Monat" value={euro(s.revenueMonthNet)} hint="netto, bezahlt" />
        <Stat label="Umsatz gesamt" value={euro(s.revenueTotalNet)} hint="netto, bezahlt" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card title="Letzte Anfragen">
          {inquiries.length === 0 ? (
            <p className="text-muted">Noch keine Anfragen.</p>
          ) : (
            <ul role="list" className="divide-y divide-ink/12">
              {inquiries.map((i) => (
                <li key={i.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/anfragen/${i.id}`} className="link-line font-medium">{i.name}</Link>
                    <p className="truncate text-sm text-muted">{topicLabel(i.topic)} · {fmtDate(i.created_at)}</p>
                  </div>
                  <Badge kind="inquiry" value={i.status} />
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/anfragen" className="link-line mt-4 inline-block text-sm">Alle Anfragen</Link>
        </Card>
        <Card title="Letzte Bestellungen">
          {orders.length === 0 ? (
            <p className="text-muted">Noch keine Bestellungen.</p>
          ) : (
            <ul role="list" className="divide-y divide-ink/12">
              {orders.map((o) => (
                <li key={o.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/bestellungen/${o.id}`} className="link-line font-medium">{o.name || o.email || `Bestellung ${o.id}`}</Link>
                    <p className="truncate text-sm text-muted">
                      {parseOrderItems(o).map((l) => `${l.quantity}× ${l.title}`).join(", ")} · {euro(o.gross_cents)}
                    </p>
                  </div>
                  <Badge kind="payment" value={o.payment_status} />
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/bestellungen" className="link-line mt-4 inline-block text-sm">Alle Bestellungen</Link>
        </Card>
      </div>

      <Readiness checks={checks} open={open} />
      <p className="mt-6 text-sm text-muted">
        Datenschutz: Erledigte und als Spam markierte Anfragen werden nach {RETENTION_DAYS} Tagen automatisch gelöscht{purged > 0 ? ` (jetzt ${purged} gelöscht)` : ""}. Bestellungen bleiben für die gesetzliche Aufbewahrung erhalten.
      </p>
    </>
  );
}

function Readiness({ checks, open }: { checks: ReturnType<typeof readiness>; open: number }) {
  return (
    <Card title={open === 0 ? "Bereitschaft: alles eingerichtet" : `Bereitschaft: ${open} Punkt${open === 1 ? "" : "e"} offen`} className="mt-8">
      <ul role="list" className="divide-y divide-ink/12">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 py-3">
            <span aria-hidden="true" className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs ${c.ok ? "bg-[#dfeedd]" : "bg-[#f3d9a8]"}`}>{c.ok ? "✓" : "!"}</span>
            <div>
              <p><span className="sr-only">{c.ok ? "Erledigt: " : "Offen: "}</span>{c.label}</p>
              <p className="text-sm text-muted">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
