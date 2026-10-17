"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";
import { getService } from "@/content/services";
import { quoteCart, type CartItem, type CartQuote } from "@/lib/checkout/pricing";
import { cartStore } from "./cartStore";
import { CartDrawer } from "./CartDrawer";

type CartContextValue = {
  items: CartItem[];
  count: number;
  quote: CartQuote | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Legt ein Angebot in den Warenkorb; `openDrawer` zeigt danach die Schublade. */
  add: (slug: string, quantity?: number, openDrawer?: boolean) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart braucht den CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const [open, setOpen] = useState(false);

  const add = useCallback((slug: string, quantity = 1, openDrawer = true) => {
    cartStore.add(slug, quantity);
    if (openDrawer) setOpen(true);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((a, i) => a + i.quantity, 0),
      quote: quoteCart(items, getService),
      open,
      setOpen,
      add,
      setQuantity: cartStore.setQuantity,
      remove: cartStore.remove,
      clear: cartStore.clear,
    }),
    [items, open, add],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
