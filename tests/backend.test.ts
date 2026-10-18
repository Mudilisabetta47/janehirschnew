import { beforeEach, describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { getDb, resetDb } from "@/lib/db/db";
import {
  addActivity, deleteInquiry, getInquiry, getOrder, insertInquiry, listActivity, listInquiries, listOrders, parseOrderItems,
  purgeInquiries, setOrderPaymentByIntent, stats, updateInquiry, updateOrder, upsertOrderFromSession,
} from "@/lib/db/repo";
import { handleStripeWebhook } from "@/lib/checkout/webhook";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { createSessionToken, verifySessionToken } from "@/lib/admin/session";
import { csvCell, toCsv } from "@/lib/admin/format";
import { readiness } from "@/lib/admin/readiness";

beforeEach(() => {
  process.env.DATA_DIR = ":memory:";
  delete process.env.STORE_ENABLED;
  resetDb();
});

const inq = { name: "Anna Beispiel", email: "anna@example.com", phone: "", salon: "", topic: "einzelcoaching", message: "Ich hätte gern ein Einzelcoaching." };

const session = (over: Partial<Stripe.Checkout.Session> = {}) =>
  ({
    id: "cs_test_1", payment_status: "paid", livemode: false, amount_total: 106981, payment_intent: "pi_1",
    metadata: { items: "einzelcoaching:1", net_cents: "89900", vat_cents: "17081", name: "Anna Beispiel", company: "Salon Test", vat_id: "DE123456789", wish: "Frühjahr" },
    customer_details: { name: "Anna Beispiel", email: "anna@example.com", phone: "0173", address: { line1: "Musterweg 1", postal_code: "28844", city: "Weyhe", country: "DE" } },
    ...over,
  }) as unknown as Stripe.Checkout.Session;

describe("Datenbank & Anfragen", () => {
  it("legt das Schema an und speichert Anfragen mit Verlauf", () => {
    const id = insertInquiry(inq);
    const row = getInquiry(id)!;
    expect(row).toMatchObject({ ...inq, status: "neu" });
    expect(listActivity("inquiry", id)[0]!.text).toMatch(/eingegangen/);
    expect(getDb().prepare("PRAGMA user_version").get()).toMatchObject({ user_version: 1 });
  });
  it("ändert Status/Notiz, protokolliert und setzt beantwortet_am", () => {
    const id = insertInquiry(inq);
    expect(updateInquiry(id, { status: "beantwortet", notes: "Termin vorgeschlagen" })).toBe(true);
    const row = getInquiry(id)!;
    expect(row).toMatchObject({ status: "beantwortet", notes: "Termin vorgeschlagen" });
    expect(row.answered_at).toBeTruthy();
    expect(listActivity("inquiry", id).map((a) => a.text).join("|")).toMatch(/Status: Neu → Beantwortet/);
  });
  it("lehnt unbekannte Status-Werte ab (Status bleibt)", () => {
    const id = insertInquiry(inq);
    updateInquiry(id, { status: "hack'; DROP TABLE inquiries;--" });
    expect(getInquiry(id)!.status).toBe("neu");
  });
  it("sucht und filtert; SQL-Sonderzeichen in der Suche sind unschädlich", () => {
    insertInquiry(inq);
    insertInquiry({ ...inq, name: "Berta", message: "Frage zum Saloncoaching", topic: "saloncoaching" });
    expect(listInquiries({ q: "Salon" })).toHaveLength(1);
    expect(listInquiries({ q: "'; DROP TABLE inquiries; --" })).toHaveLength(0);
    expect(listInquiries({ status: "neu" })).toHaveLength(2);
    expect(listInquiries({ status: "erledigt" })).toHaveLength(0);
  });
  it("löscht Anfragen samt Verlauf", () => {
    const id = insertInquiry(inq);
    expect(deleteInquiry(id)).toBe(true);
    expect(getInquiry(id)).toBeUndefined();
    expect(listActivity("inquiry", id)).toHaveLength(0);
  });
  it("löscht erledigte Anfragen nach Aufbewahrungsfrist, offene nie", () => {
    const old = insertInquiry(inq);
    const open = insertInquiry({ ...inq, name: "Offen" });
    const recent = insertInquiry({ ...inq, name: "Neu erledigt" });
    updateInquiry(old, { status: "erledigt" });
    updateInquiry(recent, { status: "erledigt" });
    const past = new Date(Date.now() - 400 * 86_400_000).toISOString();
    getDb().prepare("UPDATE inquiries SET updated_at = ? WHERE id IN (?, ?)").run(past, old, open);
    expect(purgeInquiries(180)).toBe(1);
    expect(getInquiry(old)).toBeUndefined();
    expect(getInquiry(open)).toBeDefined();
    expect(getInquiry(recent)).toBeDefined();
  });
});

describe("Bestellungen", () => {
  it("speichert eine bezahlte Sitzung vollständig und idempotent", () => {
    const a = upsertOrderFromSession(session());
    const b = upsertOrderFromSession(session());
    expect(a).toMatchObject({ created: true, becamePaid: true });
    expect(b).toMatchObject({ id: a.id, created: false, becamePaid: false });
    expect(listOrders()).toHaveLength(1);
    const o = getOrder(a.id)!;
    expect(o).toMatchObject({ name: "Anna Beispiel", company: "Salon Test", email: "anna@example.com", zip: "28844", vat_id: "DE123456789", wish: "Frühjahr", gross_cents: 106981, payment_status: "paid", livemode: 0 });
    expect(parseOrderItems(o)).toEqual([{ slug: "einzelcoaching", title: "Einzelcoaching", quantity: 1, netCents: 89900 }]);
  });
  it("legt unbezahlte Sitzungen als offen an und meldet später „bezahlt“ genau einmal", () => {
    const first = upsertOrderFromSession(session({ payment_status: "unpaid" }));
    expect(first.becamePaid).toBe(false);
    expect(getOrder(first.id)!.payment_status).toBe("pending");
    const later = upsertOrderFromSession(session({ payment_status: "paid" }));
    expect(later).toMatchObject({ id: first.id, becamePaid: true });
    expect(upsertOrderFromSession(session()).becamePaid).toBe(false);
  });
  it("erfasst Erstattungen über die Payment-Intent-ID und überschreibt sie nicht mehr", () => {
    const { id } = upsertOrderFromSession(session());
    expect(setOrderPaymentByIntent("pi_1", "refunded")).toBe(id);
    expect(getOrder(id)!.payment_status).toBe("refunded");
    upsertOrderFromSession(session());
    expect(getOrder(id)!.payment_status).toBe("refunded");
    expect(setOrderPaymentByIntent("pi_unbekannt", "refunded")).toBeNull();
  });
  it("Status/Notiz ändern, Kennzahlen zählen nur bezahlte, nicht stornierte Bestellungen", () => {
    const { id } = upsertOrderFromSession(session());
    upsertOrderFromSession(session({ id: "cs_test_2", payment_intent: "pi_2", metadata: { ...session().metadata, net_cents: "44900" } }));
    updateOrder(id, { status: "termin_abgestimmt", notes: "12.05." });
    expect(getOrder(id)).toMatchObject({ status: "termin_abgestimmt", notes: "12.05." });
    expect(stats().revenueTotalNet).toBe(89900 + 44900);
    updateOrder(id, { status: "storniert" });
    expect(stats().revenueTotalNet).toBe(44900);
    addActivity("order", id, "x");
    expect(listActivity("order", id).length).toBeGreaterThan(2);
  });
});

describe("Webhook speichert zuerst, dann Mail", () => {
  const hook = (event: unknown) => ({ webhooks: { constructEvent: vi.fn(() => event) } }) as unknown as Pick<Stripe, "webhooks">;
  const wreq = () => new Request("https://a.de/api/stripe/webhook", { method: "POST", headers: { "stripe-signature": "t=1,v1=abc" }, body: "{}" });

  it("speichert die Bestellung, benachrichtigt einmal und merkt sich den Mailstatus", async () => {
    const notify = vi.fn().mockResolvedValue("dry-run");
    const ev = { type: "checkout.session.completed", data: { object: session() } };
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200);
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200); // Stripe-Wiederholung
    expect(notify).toHaveBeenCalledTimes(1);
    const o = listOrders()[0]!;
    expect(o.mail_state).toBe("nicht_konfiguriert");
  });
  it("Mail scheitert → Bestellung bleibt gespeichert, Antwort 200 (kein doppeltes Speichern bei Wiederholung)", async () => {
    const notify = vi.fn().mockRejectedValue(new Error("smtp down"));
    const ev = { type: "checkout.session.completed", data: { object: session() } };
    expect((await handleStripeWebhook(wreq(), { stripe: hook(ev), notify })).status).toBe(200);
    expect(listOrders()).toHaveLength(1);
    expect(listOrders()[0]!.mail_state).toBe("fehlgeschlagen");
  });
  it("verarbeitet fehlgeschlagene Zahlung und Erstattung", async () => {
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session({ payment_status: "unpaid" }) } }), notify: vi.fn() });
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.async_payment_failed", data: { object: session() } }), notify: vi.fn() });
    expect(listOrders()[0]!.payment_status).toBe("failed");
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.async_payment_succeeded", data: { object: session() } }), notify: vi.fn() });
    await handleStripeWebhook(wreq(), { stripe: hook({ type: "charge.refunded", data: { object: { payment_intent: "pi_1" } } }), notify: vi.fn() });
    expect(listOrders()[0]!.payment_status).toBe("refunded");
  });
  it("ohne Speicher: Mailfehler → 500 (Stripe wiederholt)", async () => {
    process.env.STORE_ENABLED = "false";
    const notify = vi.fn().mockRejectedValue(new Error("smtp down"));
    const res = await handleStripeWebhook(wreq(), { stripe: hook({ type: "checkout.session.completed", data: { object: session() } }), notify });
    expect(res.status).toBe(500);
  });
});

describe("Backend-Zugang", () => {
  it("hasht Passwörter mit Salt und prüft sie", () => {
    const h = hashPassword("ein-langes-passwort");
    expect(h).toMatch(/^scrypt:\d+:8:1:[0-9a-f]+:[0-9a-f]+$/);
    expect(h).not.toContain("$");
    expect(verifyPassword("ein-langes-passwort", h)).toBe(true);
    expect(verifyPassword("falsch", h)).toBe(false);
    expect(hashPassword("ein-langes-passwort")).not.toBe(h);
  });
  it("lehnt kaputte oder manipulierte Hashes ab", () => {
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "scrypt:16384:8:1:zz:zz")).toBe(false);
    expect(verifyPassword("x", "md5:1:2:3:4:5")).toBe(false);
  });
  it("signiert Sitzungen, erkennt Ablauf und Manipulation", () => {
    const secret = "s".repeat(40);
    const t = createSessionToken(secret, 1_700_000_000_000, 60);
    expect(verifySessionToken(t, secret, 1_700_000_030_000)).toBe(true);
    expect(verifySessionToken(t, secret, 1_700_000_061_000)).toBe(false);
    expect(verifySessionToken(t, "x".repeat(40), 1_700_000_030_000)).toBe(false);
    expect(verifySessionToken(t.replace(/.$/, "0"), secret, 1_700_000_030_000)).toBe(false);
    expect(verifySessionToken(undefined, secret)).toBe(false);
    expect(verifySessionToken("müll", secret)).toBe(false);
  });
});

describe("CSV & Bereitschaft", () => {
  it("entschärft Formeln, verdoppelt Anführungszeichen und nutzt Semikolon + BOM", () => {
    expect(csvCell("=HYPERLINK(\"x\")")).toBe(`"'=HYPERLINK(""x"")"`);
    expect(csvCell("+49 173")).toBe(`"'+49 173"`);
    expect(csvCell('sagt "hallo"')).toBe('"sagt ""hallo"""');
    const csv = toCsv([["a", "b"], [1, "c;d"]]);
    expect(csv.startsWith("﻿")).toBe(true);
    expect(csv).toContain('"1";"c;d"');
  });
  it("Bereitschafts-Check meldet fehlende Einrichtung ehrlich", () => {
    const empty = readiness({} as NodeJS.ProcessEnv);
    const by = Object.fromEntries(empty.map((c) => [c.label, c.ok]));
    expect(by["E-Mail-Benachrichtigung aktiv"]).toBe(false);
    expect(by["Backend-Passwort gesetzt"]).toBe(false);
    expect(by["Online-Zahlung (Stripe) aktiv"]).toBe(false);
    const ready = readiness({ SMTP_HOST: "smtp.ionos.de", CONTACT_TO: "a@b.de", CONTACT_FROM: "x@y.de", MAIL_SEND_ENABLED: "true", ADMIN_PASSWORD_HASH: "h", STRIPE_SECRET_KEY: "sk_test_1", STRIPE_WEBHOOK_SECRET: "whsec", FORM_SECRET: "f".repeat(40) } as unknown as NodeJS.ProcessEnv);
    const ok = Object.fromEntries(ready.map((c) => [c.label, c.ok]));
    expect(ok["E-Mail-Benachrichtigung aktiv"]).toBe(true);
    expect(ok["Backend-Passwort gesetzt"]).toBe(true);
    expect(ok["Online-Zahlung (Stripe) aktiv"]).toBe(true);
  });
});
