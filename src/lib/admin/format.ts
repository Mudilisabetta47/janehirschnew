export const fmtDate = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(iso)) : "–";

export const fmtDay = (iso: string | null | undefined) =>
  iso ? new Intl.DateTimeFormat("de-DE", { dateStyle: "medium", timeZone: "Europe/Berlin" }).format(new Date(iso)) : "–";

/** CSV-Zelle: Anführungszeichen verdoppeln, Formel-Einleiter (=, +, -, @) entschärfen (CSV-Injection). */
export function csvCell(v: unknown): string {
  let s = v === null || v === undefined ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export const toCsv = (rows: unknown[][]) => "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n") + "\r\n";
