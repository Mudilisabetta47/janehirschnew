import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/admin/auth";
import { logoutAction } from "./actions";
import { stats } from "@/lib/db/repo";
import { storeEnabled } from "@/lib/db/db";

export const metadata: Metadata = { title: { default: "Backend", template: "%s | Backend" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  let newInquiries = 0;
  let newOrders = 0;
  if (authed && storeEnabled()) {
    try {
      const s = await stats();
      newInquiries = s.newInquiries;
      newOrders = s.newOrders;
    } catch {
      /* Datenbank nicht erreichbar → Dashboard zeigt den Fehler */
    }
  }
  const link = "link-line px-1 py-1 text-[0.78rem] uppercase tracking-[0.18em]";
  return (
    <div className="min-h-screen bg-bone text-ink">
      <header className="border-b border-ink/15 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link href="/admin" className="font-display text-2xl">
            Jane Hirsch <span className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-rose-deep">Backend</span>
          </Link>
          {authed && (
            <nav aria-label="Backend" className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="/admin" className={link}>Übersicht</Link>
              <Link href="/admin/anfragen" className={link}>
                Anfragen{newInquiries > 0 && <span className="ml-1.5 rounded-full bg-rose px-2 py-0.5 text-[0.65rem]">{newInquiries}</span>}
              </Link>
              <Link href="/admin/bestellungen" className={link}>
                Bestellungen{newOrders > 0 && <span className="ml-1.5 rounded-full bg-rose px-2 py-0.5 text-[0.65rem]">{newOrders}</span>}
              </Link>
              <Link href="/" className={link}>Website ansehen</Link>
              <form action={logoutAction}>
                <button type="submit" className={`${link} cursor-pointer`}>Abmelden</button>
              </form>
            </nav>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </div>
  );
}
