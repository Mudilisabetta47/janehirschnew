import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate } from "@/lib/admin/format";
import { listOrders, orderStatusLabel, parseOrderItems } from "@/lib/db/repo";
import { euro } from "@/lib/checkout/pricing";
import { Badge, btnGhost } from "@/components/admin/ui";
import { Filters } from "@/components/admin/Filters";

export const metadata = { title: "Bestellungen" };
export const dynamic = "force-dynamic";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status, q } = await searchParams;
  const rows = await listOrders({ status, q });
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl font-light">Bestellungen</h1>
        <Link href="/admin/export/bestellungen" prefetch={false} download className={btnGhost}>CSV-Export</Link>
      </div>
      <Filters statuses={orderStatusLabel} current={status} q={q} />
      {rows.length === 0 ? (
        <p className="text-muted">Keine Bestellungen gefunden.</p>
      ) : (
        <div className="overflow-x-auto border border-ink/15 bg-white/60">
          <table className="w-full min-w-[48rem] text-left text-[0.95rem]">
            <thead className="border-b border-ink/15 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="p-3">Datum</th>
                <th className="p-3">Kunde</th>
                <th className="p-3">Bestellung</th>
                <th className="p-3 text-right">Brutto</th>
                <th className="p-3">Zahlung</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((o) => (
                <tr key={o.id} className="align-top hover:bg-blush/50">
                  <td className="whitespace-nowrap p-3">{fmtDate(o.created_at)}</td>
                  <td className="p-3">
                    <Link href={`/admin/bestellungen/${o.id}`} className="link-line font-medium">{o.name || o.email || `#${o.id}`}</Link>
                    {o.company && <p className="text-sm text-muted">{o.company}</p>}
                  </td>
                  <td className="p-3">{parseOrderItems(o).map((l) => `${l.quantity}× ${l.title}`).join(", ")}</td>
                  <td className="whitespace-nowrap p-3 text-right">{euro(o.gross_cents)}</td>
                  <td className="p-3"><Badge kind="payment" value={o.payment_status} /></td>
                  <td className="p-3"><Badge kind="order" value={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") && <p className="mt-4 text-sm text-muted">Hinweis: Stripe läuft im Testmodus – Bestellungen sind Testkäufe.</p>}
    </>
  );
}
