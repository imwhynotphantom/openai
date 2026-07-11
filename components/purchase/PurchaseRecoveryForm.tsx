"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { css } from "@/lib/css";
import { useMyPurchaseCopy } from "@/hooks/useMyPurchaseCopy";
import { SinWalletStep } from "@/components/buy/steps/SinWalletStep";

type Props = {
  onAuthenticated?: () => void;
  showBuyLink?: boolean;
};

export function PurchaseRecoveryForm({ onAuthenticated, showBuyLink = true }: Props) {
  const mp = useMyPurchaseCopy();
  const { address, isConnected } = useAccount();
  const [walletLoading, setWalletLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tryWalletAuth = async (claimAddress: string) => {
    setWalletLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/purchase-wallet-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimAddress }),
      });
      if (r.status === 404) {
        setError(mp.recoveryWalletNotFound);
        return;
      }
      if (!r.ok) throw new Error("auth failed");
      onAuthenticated?.();
    } catch {
      setError(mp.recoveryError);
    } finally {
      setWalletLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) void tryWalletAuth(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  return (
    <div style={css("max-width:480px;margin:0 auto")}>
      <h2 style={css("font:700 26px/1.15 var(--font-hanken);color:#0D0D0D;margin:0 0 8px;text-align:center")}>
        {mp.recoveryTitle}
      </h2>
      <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 20px;text-align:center")}>
        {mp.recoveryWalletHint}
      </p>

      <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#fff")}>
        {walletLoading ? (
          <p style={css("font:400 13px var(--font-hanken);color:#8A8A94;margin:0")}>{mp.recoveryWalletLoading}</p>
        ) : isConnected && address ? null : (
          <SinWalletStep embedded />
        )}
      </div>

      {error ? <p style={css("font:500 13px var(--font-hanken);color:#D14343;margin:14px 0 0;text-align:center")}>{error}</p> : null}

      {showBuyLink ? (
        <p style={css("font:400 13px var(--font-hanken);color:#8A8A94;margin:20px 0 0;text-align:center")}>
          <Link href="/comprar" style={css("color:#0D0D0D;font-weight:600")}>
            {mp.buyMoreCta}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
