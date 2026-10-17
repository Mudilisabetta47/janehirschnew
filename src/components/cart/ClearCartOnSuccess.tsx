"use client";

import { useEffect } from "react";
import { cartStore } from "./cartStore";

/** Leert den Warenkorb nach erfolgreicher Bezahlung (Danke-Seite). */
export function ClearCartOnSuccess() {
  useEffect(() => {
    cartStore.clear();
  }, []);
  return null;
}
