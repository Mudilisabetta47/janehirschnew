import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { fmtDate } from "@/lib/admin/format";
import { inquiryStatusLabel, listInquiries } from "@/lib/db/repo";
import { topicLabel } from "@/lib/contact/topics";
import { Badge, btnGhost } from "@/components/admin/ui";
import { Filters } from "@/components/admin/Filters";

export const metadata = { title: "Anfragen" };
export const dynamic = "force-dynamic";

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; geloescht?: string }> }) {
  await requireAdmin();
  const { status, q, geloescht } = await searchParams;
  const rows = await listInquiries({ status, q });
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-5xl font-light">Anfragen</h1>
        <Link href="/admin/export/anfragen" prefetch={false} download className={btnGhost}>CSV-Export</Link>
      </div>
      {geloescht && <p role="status" className="mb-6 border-l-2 border-[#4a7c59] pl-4">Anfrage gelöscht.</p>}
      <Filters statuses={inquiryStatusLabel} current={status} q={q} />
      {rows.length === 0 ? (
        <p className="text-muted">Keine Anfragen gefunden.</p>
      ) : (
        <div className="overflow-x-auto border border-ink/15 bg-white/60">
          <table className="w-full min-w-[40rem] text-left text-[0.95rem]">
            <thead className="border-b border-ink/15 text-[0.72rem] uppercase tracking-[0.16em] text-muted">
              <tr>
                <th className="p-3">Eingang</th>
                <th className="p-3">Name</th>
                <th className="p-3">Thema</th>
                <th className="p-3">Status</th>
                <th className="p-3">Mail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {rows.map((i) => (
                <tr key={i.id} className="align-top hover:bg-blush/50">
                  <td className="whitespace-nowrap p-3">{fmtDate(i.created_at)}</td>
                  <td className="p-3">
                    <Link href={`/admin/anfragen/${i.id}`} className="link-line font-medium">{i.name}</Link>
                    <p className="max-w-xs truncate text-sm text-muted">{i.message}</p>
                  </td>
                  <td className="p-3">{topicLabel(i.topic)}</td>
                  <td className="p-3"><Badge kind="inquiry" value={i.status} /></td>
                  <td className="p-3 text-sm text-muted">{i.mail_state.replace("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
