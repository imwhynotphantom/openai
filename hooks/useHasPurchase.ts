"use client";

import { useCallback, useEffect, useState } from "react";

/** true si la cookie op_buyer es válida (comprador registrado). */
export function useHasPurchase() {
  const [hasPurchase, setHasPurchase] = useState(false);

  const check = useCallback(async () => {
    try {
      const r = await fetch("/api/deposit-status", { cache: "no-store" });
      setHasPurchase(r.ok);
    } catch {
      setHasPurchase(false);
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return { hasPurchase, refreshPurchase: check };
}
