import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate } from "@/lib/admin/format";
import { getOrder, listActivity, orderStatusLabel, parseOrderItems } from "@/lib/db/repo";
import { euro } from "@/lib/checkout/pricing";
import { site } from "@/content/site";
import { saveOrderAction } from "../../actions";
import { Badge, btnCls, btnGhost, Card, inputCls } from "@/components/admin/ui";

export const metadata = { title: "Bestellung" };
export const dynamic = "force-dynamic";

export default async function OrderDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ gespeichert?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const o = Number.isInteger(Number(id)) ? await getOrder(Number(id)) : undefined;
  if (!o) notFound();
  const lines = parseOrderItems(o);
  const activity = await listActivity("order", o.id);
  const first = (o.name.split(" ")[0] ?? o.name) || "";
  const mail = `mailto:${o.email}?subject=${encodeURIComponent("Deine Buchung bei Jane Hirsch")}&body=${encodeURIComponent(`Hallo ${first},\n\nvielen Dank für deine Buchung! Ich melde mich wegen eines Termins bei dir.\n\nLiebe Grüße\nJane Hirsch\n${site.phone.display}`)}`;
  const stripeUrl = o.payment_intent ? `https://dashboard.stripe.com/${o.livemode ? "" : "test/"}payments/${o.payment_intent}` : null;
  const addr = [o.street, [o.zip, o.city].filter(Boolean).join(" ")].filter(Boolean);

  return (
    <>
      <p className="mb-4 text-sm"><Link href="/admin/bestellungen" className="link-line">← Alle Bestellungen</Link></p>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-5xl font-light">Bestellung {o.id}</h1>
        <Badge kind="payment" value={o.payment_status} />
        <Badge kind="order" value={o.status} />
        {!o.livemode && <span className="rounded-full bg-ink/10 px-3 py-1 text-[0.72rem] uppercase tracking-[0.12em]">Testkauf</span>}
      </div>
      {sp.gespeichert && <p role="status" className="mb-6 border-l-2 border-[#4a7c59] pl-4">Gespeichert.</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Positionen" className="lg:col-span-2">
          <table className="w-full text-left text-[0.95rem]">
            <tbody className="divide-y divide-ink/12">
              {lines.map((l) => (
                <tr key={l.slug}>
                  <td className="py-3">{l.quantity} × {l.title}</td>
                  <td className="py-3 text-right">{euro(l.netCents)} netto</td>
                </tr>
              ))}
              <tr><td className="py-3 text-muted">MwSt. 19 %</td><td className="py-3 text-right text-muted">{euro(o.vat_cents)}</td></tr>
              <tr><td className="py-3 font-medium">Gesamt (brutto)</td><td className="py-3 text-right font-display text-3xl">{euro(o.gross_cents)}</td></tr>
            </tbody>
          </table>
          {o.wish && <p className="mt-4 border-l-2 border-rose-deep pl-4"><span className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Wunschzeitraum</span><br />{o.wish}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            {o.email && <a href={mail} className={btnGhost}>Kunde anschreiben</a>}
            {stripeUrl && <a href={stripeUrl} target="_blank" rel="noopener noreferrer" className={btnGhost}>In Stripe öffnen</a>}
          </div>
        </Card>

        <Card title="Kunde">
          <dl className="space-y-3 text-[0.95rem]">
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Name</dt><dd>{o.name || "–"}</dd></div>
            {o.company && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Firma</dt><dd>{o.company}</dd></div>}
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">E-Mail</dt><dd>{o.email ? <a className="link-line break-all" href={`mailto:${o.email}`}>{o.email}</a> : "–"}</dd></div>
            {o.phone && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Telefon</dt><dd><a className="link-line" href={`tel:${o.phone.replace(/[^+\d]/g, "")}`}>{o.phone}</a></dd></div>}
            {addr.length > 0 && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Anschrift</dt><dd>{addr.map((a) => <span key={a} className="block">{a}</span>)}</dd></div>}
            {o.vat_id && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">USt-IdNr.</dt><dd>{o.vat_id}</dd></div>}
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Bestellt</dt><dd>{fmtDate(o.created_at)}</dd></div>
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Bezahlt</dt><dd>{fmtDate(o.paid_at)}</dd></div>
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Benachrichtigungsmail</dt><dd>{o.mail_state.replace("_", " ")}</dd></div>
          </dl>
        </Card>

        <Card title="Bearbeitung" className="lg:col-span-2">
          <form action={saveOrderAction} className="space-y-5">
            <input type="hidden" name="id" value={o.id} />
            <div>
              <label htmlFor="status" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Status</label>
              <select id="status" name="status" defaultValue={o.status} className={`${inputCls} max-w-xs`}>
                {Object.entries(orderStatusLabel).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Interne Notiz (z. B. vereinbarter Termin)</label>
              <textarea id="notes" name="notes" rows={5} maxLength={5000} defaultValue={o.notes} className={inputCls} />
            </div>
            <button type="submit" className={btnCls}>Speichern</button>
          </form>
        </Card>

        <Card title="Verlauf">
          <ul role="list" className="space-y-3 text-sm">
            {activity.map((a) => (
              <li key={a.id}><span className="text-muted">{fmtDate(a.at)}</span><br />{a.text}</li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
