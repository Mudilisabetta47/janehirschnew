import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate } from "@/lib/admin/format";
import { getInquiry, inquiryStatusLabel, listActivity } from "@/lib/db/repo";
import { topicLabel } from "@/lib/contact/topics";
import { site } from "@/content/site";
import { deleteInquiryAction, saveInquiryAction } from "../../actions";
import { Badge, btnCls, btnGhost, Card, inputCls } from "@/components/admin/ui";

export const metadata = { title: "Anfrage" };
export const dynamic = "force-dynamic";

/** Antwort-Vorlagen als mailto-Links (öffnen das Mailprogramm von Jane; es wird nichts automatisch gesendet). */
function replyLinks(i: { name: string; email: string; topic: string }) {
  const first = i.name.split(" ")[0] ?? i.name;
  const subj = (s: string) => encodeURIComponent(`${s} – ${topicLabel(i.topic)}`);
  const sign = `\n\nLiebe Grüße\nJane Hirsch\n${site.phone.display}`;
  const body = (t: string) => encodeURIComponent(`Hallo ${first},\n\n${t}${sign}`);
  return [
    { label: "Antwort", href: `mailto:${i.email}?subject=${subj("Re: Deine Anfrage")}&body=${body("vielen Dank für deine Nachricht!\n\n")}` },
    { label: "Erstgespräch vorschlagen", href: `mailto:${i.email}?subject=${subj("Kostenloses Erstgespräch")}&body=${body("gern lernen wir uns in einem kostenlosen Erstgespräch kennen. Passt dir einer dieser Termine?\n\n– \n– \n– ")}` },
    { label: "Rückfrage", href: `mailto:${i.email}?subject=${subj("Kurze Rückfrage")}&body=${body("danke für deine Anfrage. Damit ich dir ein passendes Angebot machen kann, brauche ich noch kurz eine Info von dir:\n\n")}` },
  ];
}

export default async function InquiryDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ gespeichert?: string; fehler?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const row = Number.isInteger(Number(id)) ? getInquiry(Number(id)) : undefined;
  if (!row) notFound();
  const activity = listActivity("inquiry", row.id);

  return (
    <>
      <p className="mb-4 text-sm"><Link href="/admin/anfragen" className="link-line">← Alle Anfragen</Link></p>
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="font-display text-5xl font-light">{row.name}</h1>
        <Badge kind="inquiry" value={row.status} />
      </div>
      {sp.gespeichert && <p role="status" className="mb-6 border-l-2 border-[#4a7c59] pl-4">Gespeichert.</p>}
      {sp.fehler && <p role="alert" className="mb-6 border-l-2 border-[#9b2c1f] pl-4 text-[#9b2c1f]">Zum Löschen bitte das Häkchen setzen.</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Nachricht" className="lg:col-span-2">
          <p className="whitespace-pre-wrap text-lg">{row.message}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {replyLinks(row).map((l) => (
              <a key={l.label} href={l.href} className={btnGhost}>{l.label}</a>
            ))}
          </div>
        </Card>
        <Card title="Kontakt">
          <dl className="space-y-3 text-[0.95rem]">
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">E-Mail</dt><dd><a className="link-line break-all" href={`mailto:${row.email}`}>{row.email}</a></dd></div>
            {row.phone && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Telefon</dt><dd><a className="link-line" href={`tel:${row.phone.replace(/[^+\d]/g, "")}`}>{row.phone}</a></dd></div>}
            {row.salon && <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Salon</dt><dd>{row.salon}</dd></div>}
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Thema</dt><dd>{topicLabel(row.topic)}</dd></div>
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Eingang</dt><dd>{fmtDate(row.created_at)}</dd></div>
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Datenschutz bestätigt</dt><dd>{fmtDate(row.consent_at)}</dd></div>
            <div><dt className="text-[0.72rem] uppercase tracking-[0.18em] text-muted">Benachrichtigungsmail</dt><dd>{row.mail_state.replace("_", " ")}</dd></div>
          </dl>
        </Card>

        <Card title="Bearbeitung" className="lg:col-span-2">
          <form action={saveInquiryAction} className="space-y-5">
            <input type="hidden" name="id" value={row.id} />
            <div>
              <label htmlFor="status" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Status</label>
              <select id="status" name="status" defaultValue={row.status} className={`${inputCls} max-w-xs`}>
                {Object.entries(inquiryStatusLabel).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Interne Notiz</label>
              <textarea id="notes" name="notes" rows={5} maxLength={5000} defaultValue={row.notes} className={inputCls} />
            </div>
            <button type="submit" className={btnCls}>Speichern</button>
          </form>
        </Card>

        <div className="space-y-6">
          <Card title="Verlauf">
            <ul role="list" className="space-y-3 text-sm">
              {activity.map((a) => (
                <li key={a.id}><span className="text-muted">{fmtDate(a.at)}</span><br />{a.text}</li>
              ))}
            </ul>
          </Card>
          <Card title="Löschen">
            <form action={deleteInquiryAction} className="space-y-3">
              <input type="hidden" name="id" value={row.id} />
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" name="confirm" value="ja" className="mt-1 h-4 w-4 accent-[#8a5a48]" />
                Anfrage endgültig löschen (z. B. auf Wunsch der Person)
              </label>
              <button type="submit" className={btnGhost}>Löschen</button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
