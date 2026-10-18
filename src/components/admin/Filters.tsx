import { btnGhost, inputCls } from "./ui";

/** GET-Filter (Status + Suche) – ohne JavaScript nutzbar. */
export function Filters({ statuses, current, q }: { statuses: Record<string, string>; current?: string; q?: string }) {
  return (
    <form method="get" className="mb-6 flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="status" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Status</label>
        <select id="status" name="status" defaultValue={current ?? ""} className={`${inputCls} min-w-44`}>
          <option value="">Alle</option>
          {Object.entries(statuses).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>
      <div className="min-w-56 flex-1">
        <label htmlFor="q" className="mb-1 block text-[0.72rem] uppercase tracking-[0.2em]">Suche</label>
        <input id="q" name="q" defaultValue={q ?? ""} placeholder="Name, E-Mail, Text …" className={inputCls} />
      </div>
      <button type="submit" className={btnGhost}>Filtern</button>
    </form>
  );
}
