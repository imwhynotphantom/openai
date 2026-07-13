"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

type PurchaseContextValue = {
  hasPurchase: boolean;
  refreshPurchase: () => Promise<void>;
};

const PurchaseContext = createContext<PurchaseContextValue | null>(null);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [hasPurchase, setHasPurchase] = useState(false);

  const refreshPurchase = useCallback(async () => {
    try {
      const r = await fetch("/api/deposit-status", { cache: "no-store" });
      setHasPurchase(r.ok);
    } catch {
      setHasPurchase(false);
    }
  }, []);

  useEffect(() => {
    void refreshPurchase();
  }, [refreshPurchase]);

  return <PurchaseContext.Provider value={{ hasPurchase, refreshPurchase }}>{children}</PurchaseContext.Provider>;
}

export function usePurchaseContext(): PurchaseContextValue {
  const ctx = useContext(PurchaseContext);
  if (!ctx) throw new Error("usePurchaseContext must be used within PurchaseProvider");
  return ctx;
}
