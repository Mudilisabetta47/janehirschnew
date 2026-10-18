import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

/**
 * Kleine SQLite-Datei als Backend-Speicher (Node ≥ 22.5, eingebaut – keine native Abhängigkeit).
 * Pfad: $DATA_DIR/jane.db (Standard ./data; `:memory:` für Tests). Das Verzeichnis muss auf dem
 * Hosting PERSISTENT sein (nicht bei jedem Deploy neu angelegt) – siehe docs/02-technik.md.
 */
const g = globalThis as unknown as { __janeDb?: DatabaseSync; __janeDbPath?: string };

const SCHEMA_VERSION = 1;

function migrate(db: DatabaseSync) {
  const row = db.prepare("PRAGMA user_version").get() as { user_version: number };
  if (row.user_version >= SCHEMA_VERSION) return;
  db.exec(`
    BEGIN;
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

    PRAGMA user_version = ${SCHEMA_VERSION};
    COMMIT;
  `);
}

export function dataPath(env: NodeJS.ProcessEnv = process.env): string {
  const dir = env.DATA_DIR ?? "./data";
  return dir === ":memory:" ? ":memory:" : resolve(dir, "jane.db");
}

export function getDb(): DatabaseSync {
  const path = dataPath();
  if (g.__janeDb && g.__janeDbPath === path) return g.__janeDb;
  g.__janeDb?.close();
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  migrate(db);
  g.__janeDb = db;
  g.__janeDbPath = path;
  return db;
}

/** Nur für Tests: Verbindung schließen und vergessen. */
export function resetDb() {
  g.__janeDb?.close();
  g.__janeDb = undefined;
  g.__janeDbPath = undefined;
}

/** Speicherung abschaltbar (STORE_ENABLED=false) – z. B. wenn kein dauerhaftes Verzeichnis vorhanden ist. */
export const storeEnabled = () => process.env.STORE_ENABLED !== "false";

/** Aktuelle Zeit als ISO-Text (UTC). */
export const nowIso = () => new Date().toISOString();
