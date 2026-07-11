"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { css } from "@/lib/css";
import { Hov } from "@/components/ui";
import { useMyPurchaseCopy } from "@/hooks/useMyPurchaseCopy";
import { SinWalletStep } from "@/components/buy/steps/SinWalletStep";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  onAuthenticated?: () => void;
  showBuyLink?: boolean;
};

export function PurchaseRecoveryForm({ onAuthenticated, showBuyLink = true }: Props) {
  const mp = useMyPurchaseCopy();
  const { address, isConnected } = useAccount();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailValid = EMAIL_RE.test(email.trim());

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

  const sendMagicLink = async () => {
    if (!emailValid) return;
    setSending(true);
    setError(null);
    setSent(false);
    try {
      const r = await fetch("/api/purchase-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (r.status === 404) {
        setError(mp.recoveryNotFound);
        return;
      }
      if (r.status === 429) {
        setError(mp.recoveryRateLimit);
        return;
      }
      if (!r.ok) throw new Error("send failed");
      setSent(true);
    } catch {
      setError(mp.recoveryError);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={css("max-width:480px;margin:0 auto")}>
      <h2 style={css("font:700 26px/1.15 var(--font-hanken);color:#0D0D0D;margin:0 0 8px;text-align:center")}>
        {mp.recoveryTitle}
      </h2>
      <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 20px;text-align:center")}>
        {mp.recoverySubtitle}
      </p>

      <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA;margin-bottom:16px")}>
        <input
          type="email"
          autoComplete="email"
          placeholder={mp.recoveryEmailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={css("width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #E6E6E8;border-radius:12px;font:500 14px var(--font-hanken);margin-bottom:12px;background:#fff")}
        />
        <Hov
          as="button"
          type="button"
          disabled={sending || !emailValid}
          onClick={sendMagicLink}
          style="appearance:none;cursor:pointer;width:100%;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:14px;font:600 14px var(--font-hanken)"
          hover="background:#000"
        >
          {sending ? mp.recoverySending : mp.recoverySendCta}
        </Hov>
        {sent ? (
          <p style={css("font:500 13px var(--font-hanken);color:var(--accent,#0E8C6A);margin:10px 0 0")}>{mp.recoverySent}</p>
        ) : null}
      </div>

      <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#fff")}>
        <p style={css("font:600 14px var(--font-hanken);color:#0D0D0D;margin:0 0 6px")}>{mp.recoveryWalletTitle}</p>
        <p style={css("font:400 13px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 12px")}>{mp.recoveryWalletHint}</p>
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
