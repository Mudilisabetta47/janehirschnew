import { createClient, type Client, type InValue } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Datenbank-Zugriff über libSQL (SQLite-kompatibel). Ein Codepfad für alle Hosting-Varianten:
 *  - lokal / eigener Node-Server (IONOS, VPS): Datei `$DATA_DIR/jane.db` (Standard ./data) – Verzeichnis muss persistent sein
 *  - Vercel / Serverless: gehostete Datenbank (Turso) über DATABASE_URL (`libsql://…`) + DATABASE_AUTH_TOKEN
 *    (die Vercel-Turso-Integration setzt TURSO_DATABASE_URL / TURSO_AUTH_TOKEN – beides wird erkannt)
 *  - Tests: DATA_DIR=:memory:
 */
type Cache = { client?: Client; ready?: Promise<Client>; key?: string };
const g = globalThis as unknown as { __janeDb?: Cache };

export function dbConfig(env: NodeJS.ProcessEnv = process.env): { url: string; authToken?: string; local: boolean } {
  const remote = env.DATABASE_URL ?? env.TURSO_DATABASE_URL;
  if (remote) return { url: remote, authToken: env.DATABASE_AUTH_TOKEN ?? env.TURSO_AUTH_TOKEN, local: remote.startsWith("file:") };
  const dir = env.DATA_DIR ?? "./data";
  return dir === ":memory:" ? { url: ":memory:", local: true } : { url: `file:${resolve(dir, "jane.db")}`, local: true };
}

/** Für Anzeigen im Backend: Ziel ohne Zugangsdaten. */
export function dbLabel(env: NodeJS.ProcessEnv = process.env): string {
  const c = dbConfig(env);
  return c.url.startsWith("libsql://") || c.url.startsWith("https://") ? `Turso/libSQL (${new URL(c.url.replace("libsql://", "https://")).host})` : c.url.replace(/^file:/, "");
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT NOT NULL,
  updated_at  TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL DEFAULT '',
  salon       TEXT NOT NULL DEFAULT '',
  topic       TEXT NOT NULL,
  message     TEXT NOT NULL,
  consent_at  TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'neu',
  notes       TEXT NOT NULL DEFAULT '',
  mail_state  TEXT NOT NULL DEFAULT 'offen',
  answered_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status, created_at DESC);
CREATE TABLE IF NOT EXISTS orders (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL,
  paid_at           TEXT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  payment_intent    TEXT NOT NULL DEFAULT '',
  livemode          INTEGER NOT NULL DEFAULT 0,
  payment_status    TEXT NOT NULL DEFAULT 'pending',
  items             TEXT NOT NULL,
  net_cents         INTEGER NOT NULL,
  vat_cents         INTEGER NOT NULL,
  gross_cents       INTEGER NOT NULL,
  name              TEXT NOT NULL DEFAULT '',
  company           TEXT NOT NULL DEFAULT '',
  email             TEXT NOT NULL DEFAULT '',
  phone             TEXT NOT NULL DEFAULT '',
  street            TEXT NOT NULL DEFAULT '',
  zip               TEXT NOT NULL DEFAULT '',
  city              TEXT NOT NULL DEFAULT '',
  vat_id            TEXT NOT NULL DEFAULT '',
  wish              TEXT NOT NULL DEFAULT '',
  status            TEXT NOT NULL DEFAULT 'neu',
  notes             TEXT NOT NULL DEFAULT '',
  mail_state        TEXT NOT NULL DEFAULT 'offen'
);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_pi ON orders(payment_intent);
CREATE TABLE IF NOT EXISTS activity (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  at        TEXT NOT NULL,
  entity    TEXT NOT NULL,
  entity_id INTEGER NOT NULL,
  text      TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity(entity, entity_id, id DESC);
`;

/** Verbindung (einmal pro Instanz) inklusive Schema-Anlage – alle Anweisungen sind idempotent. */
export function getDb(): Promise<Client> {
  const cfg = dbConfig();
  const key = `${cfg.url}|${cfg.authToken ? "t" : ""}`;
  const cache = (g.__janeDb ??= {});
  if (cache.ready && cache.key === key) return cache.ready;
  cache.client?.close();
  if (cfg.url.startsWith("file:")) mkdirSync(dirname(cfg.url.slice(5)), { recursive: true });
  const client = createClient({ url: cfg.url, authToken: cfg.authToken });
  cache.client = client;
  cache.key = key;
  cache.ready = (async () => {
    if (cfg.url.startsWith("file:")) await client.execute("PRAGMA journal_mode = WAL");
    await client.executeMultiple(SCHEMA);
    return client;
  })().catch((e) => {
    cache.ready = undefined; // nächster Aufruf versucht es erneut
    throw e;
  });
  return cache.ready;
}

/** Nur für Tests: Verbindung schließen und vergessen. */
export function resetDb() {
  g.__janeDb?.client?.close();
  g.__janeDb = undefined;
}

type Row = Record<string, unknown>;
const plain = (columns: string[], row: ArrayLike<unknown>): Row => Object.fromEntries(columns.map((c, i) => [c, row[i]]));

/** SELECT → Liste einfacher Objekte. */
export async function all<T = Row>(sql: string, args: InValue[] = []): Promise<T[]> {
  const rs = await (await getDb()).execute({ sql, args });
  return rs.rows.map((r) => plain(rs.columns, r) as T);
}
/** SELECT → erste Zeile oder undefined. */
export async function one<T = Row>(sql: string, args: InValue[] = []): Promise<T | undefined> {
  return (await all<T>(sql, args))[0];
}
/** INSERT/UPDATE/DELETE → betroffene Zeilen + neue ID. */
export async function run(sql: string, args: InValue[] = []): Promise<{ changes: number; lastId: number }> {
  const rs = await (await getDb()).execute({ sql, args });
  return { changes: rs.rowsAffected, lastId: Number(rs.lastInsertRowid ?? 0) };
}
/** Mehrere Schreibanweisungen atomar. */
export async function batch(statements: { sql: string; args?: InValue[] }[]): Promise<void> {
  await (await getDb()).batch(statements.map((s) => ({ sql: s.sql, args: s.args ?? [] })), "write");
}

/** Speicherung abschaltbar (STORE_ENABLED=false) – z. B. wenn weder Datei noch Datenbank zur Verfügung steht. */
export const storeEnabled = () => process.env.STORE_ENABLED !== "false";

/** Aktuelle Zeit als ISO-Text (UTC). */
export const nowIso = () => new Date().toISOString();
