import { getService } from "@/content/services";
import { MAX_CART_LINES, type CartItem } from "@/lib/checkout/pricing";

/**
 * Warenkorb im Browser (localStorage, nur Angebots-Kennung + Menge – keine Personendaten).
 * Preise werden hier nie gespeichert; sie kommen immer aus den Inhalten bzw. serverseitig.
 */
const KEY = "jh-cart-v1";
const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

/** Nur gültige, buchbare Positionen mit erlaubter Menge übernehmen. */
export function sanitizeCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const r of raw) {
    if (typeof r !== "object" || r === null) continue;
    const { slug, quantity } = r as Record<string, unknown>;
    if (typeof slug !== "string" || typeof quantity !== "number" || !Number.isInteger(quantity)) continue;
    const max = getService(slug)?.booking?.maxQuantity;
    if (!max || out.some((o) => o.slug === slug)) continue;
    out.push({ slug, quantity: Math.min(Math.max(quantity, 1), max) });
    if (out.length >= MAX_CART_LINES) break;
  }
  return out;
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    items = sanitizeCart(JSON.parse(window.localStorage.getItem(KEY) ?? "[]"));
  } catch {
    items = EMPTY;
  }
  if (items.length === 0) items = EMPTY;
}

function commit(next: CartItem[]) {
  items = next.length ? next : EMPTY;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* Speicher gesperrt: Warenkorb gilt dann nur für diese Sitzung */
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(listener: () => void) {
    load();
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      loaded = false;
      load();
      listeners.forEach((l) => l());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot(): CartItem[] {
    load();
    return items;
  },
  getServerSnapshot(): CartItem[] {
    return EMPTY;
  },
  add(slug: string, quantity = 1) {
    load();
    const max = getService(slug)?.booking?.maxQuantity;
    if (!max) return;
    const existing = items.find((i) => i.slug === slug);
    if (existing) {
      commit(items.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(i.quantity + quantity, max) } : i)));
    } else if (items.length < MAX_CART_LINES) {
      commit([...items, { slug, quantity: Math.min(Math.max(quantity, 1), max) }]);
    }
  },
  setQuantity(slug: string, quantity: number) {
    load();
    const max = getService(slug)?.booking?.maxQuantity;
    if (!max) return;
    commit(items.map((i) => (i.slug === slug ? { ...i, quantity: Math.min(Math.max(quantity, 1), max) } : i)));
  },
  remove(slug: string) {
    load();
    commit(items.filter((i) => i.slug !== slug));
  },
  clear() {
    commit([]);
  },
};
