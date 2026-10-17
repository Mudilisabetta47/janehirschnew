import { PageHero } from "@/components/sections/PageHero";

/** Sichtbar markierte Lücke, die vor Veröffentlichung gefüllt werden muss. */
export function Fill({ children }: { children: React.ReactNode }) {
  return (
    <mark className="rounded-sm bg-[#f3d9a8] px-1.5 py-0.5 font-medium text-ink">
      [ERGÄNZEN: {children}]
    </mark>
  );
}

const showDraft = process.env.NEXT_PUBLIC_LEGAL_DRAFT !== "false";

export function LegalPage({
  title,
  lead,
  todo,
  children,
}: {
  title: string;
  lead: string;
  todo: string[];
  children: React.ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title={title} lead={lead} crumbs={[{ label: "Start", href: "/" }, { label: title }]} />
      <section className="bg-bone py-16 md:py-24">
        <div className="wrap">
          {showDraft && (
            <aside role="note" className="mb-16 max-w-3xl border-l-4 border-[#c98a1c] bg-[#fbf0d9] p-6 text-ink">
              <p className="mb-2 font-medium uppercase tracking-[0.18em] text-[0.78rem]">Entwurf – nicht veröffentlichungsreif</p>
              <p className="mb-3">
                Dieser Text übernimmt die vorhandenen Angaben und wurde an die neue Website angepasst. Er ist <strong>keine Rechtsberatung</strong> und muss vor der Veröffentlichung rechtlich geprüft werden. Offen:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {todo.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </aside>
          )}
          <div className="legal max-w-3xl">{children}</div>
        </div>
      </section>
    </>
  );
}
