"use client";

import { useCallback, useEffect, useState } from "react";

export type DepositPurchaseStatus = {
  credited: number;
  pending: number;
  openEstimated: number;
  pendingOpenEstimated: number;
  hasClaimAddress: boolean;
};

export function useDepositPurchase() {
  const [status, setStatus] = useState<DepositPurchaseStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/deposit-status", { cache: "no-store" });
      if (!r.ok) {
        setStatus(null);
        return;
      }
      const data = (await r.json()) as {
        credited: number;
        pending: number;
        openEstimated: number;
        pendingOpenEstimated: number;
        hasClaimAddress: boolean;
      };
      setStatus({
        credited: data.credited,
        pending: data.pending,
        openEstimated: data.openEstimated,
        pendingOpenEstimated: data.pendingOpenEstimated,
        hasClaimAddress: data.hasClaimAddress,
      });
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const hasPresale =
    status != null && (status.credited > 0 || status.pending > 0 || status.openEstimated > 0);

  return { status, loading, hasPresale, refresh };
}
