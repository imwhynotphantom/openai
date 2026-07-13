"use client";

import { usePurchaseContext } from "@/components/providers/PurchaseProvider";

/** true si la cookie op_buyer es válida (comprador registrado). */
export function useHasPurchase() {
  return usePurchaseContext();
}
