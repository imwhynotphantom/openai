"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getAddress } from "viem";
import { css } from "@/lib/css";
import { Hov } from "@/components/ui";
import { useBuyCopy } from "@/hooks/useBuyCopy";
import { formatAddress } from "@/lib/wagmi/format-address";

type Props = {
  claimAddress: string | null;
  onLinked?: () => void;
};

/** Vincular wallet conectada (wagmi) al buyer de la cookie. Solo en /mi-compra. */
export function LinkWalletPanel({ claimAddress, onLinked }: Props) {
  const buy = useBuyCopy();
  const { address: connectedAddress } = useAccount();
  const [linking, setLinking] = useState(false);
  const [linkDone, setLinkDone] = useState(false);
  const [showReplaceConfirm, setShowReplaceConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const walletToLink = connectedAddress;

  useEffect(() => {
    setShowReplaceConfirm(false);
    setLinkDone(false);
  }, [connectedAddress]);

  if (!walletToLink) return null;

  const linkedClaim = claimAddress
    ? (() => {
        try {
          return getAddress(claimAddress);
        } catch {
          return null;
        }
      })()
    : null;
  const walletMatches =
    linkedClaim && walletToLink ? linkedClaim.toLowerCase() === walletToLink.toLowerCase() : false;
  const needsInitialLink = !linkedClaim;
  const needsReplace = Boolean(linkedClaim && !walletMatches);

  if (!needsInitialLink && !needsReplace && !(walletMatches && linkDone)) {
    if (walletMatches) {
      return (
        <p style={css("font:500 13px var(--font-hanken);color:#5C5C66;margin:0 0 16px")}>
          {buy.depositLinkWalletAlreadyLinked(formatAddress(linkedClaim!))}
        </p>
      );
    }
    return null;
  }

  const linkWallet = async (confirmReplace = false) => {
    setLinking(true);
    setError(null);
    try {
      const r = await fetch("/api/deposit-link-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimAddress: walletToLink, confirmReplace }),
      });
      if (r.status === 409) {
        const data = (await r.json()) as { needsConfirmation?: boolean };
        if (data.needsConfirmation) {
          setShowReplaceConfirm(true);
          return;
        }
      }
      if (!r.ok) throw new Error("link failed");
      setShowReplaceConfirm(false);
      setLinkDone(true);
      onLinked?.();
    } catch {
      setError(buy.depositLinkWalletError);
    } finally {
      setLinking(false);
    }
  };

  return (
    <div style={css("padding:14px 16px;border:1px solid #ECECEC;border-radius:12px;background:#FAFAFA;margin:0 0 16px")}>
      {needsReplace || showReplaceConfirm ? (
        <>
          <p style={css("font:600 14px var(--font-hanken);color:#0D0D0D;margin:0 0 8px")}>{buy.depositLinkWalletTitle}</p>
          <p style={css("font:500 13px/1.5 var(--font-hanken);color:#9A5B00;margin:0 0 12px")}>
            {buy.depositLinkWalletReplaceConfirm(formatAddress(linkedClaim!), formatAddress(walletToLink))}
          </p>
          <div style={css("display:flex;gap:8px")}>
            <Hov
              as="button"
              type="button"
              disabled={linking}
              onClick={() => setShowReplaceConfirm(false)}
              style="appearance:none;cursor:pointer;flex:1;background:#fff;color:#5C5C66;border:1px solid #E6E6E8;border-radius:12px;padding:12px;font:600 13px var(--font-hanken)"
              hover="border-color:#0D0D0D;color:#0D0D0D"
            >
              {buy.depositLinkWalletReplaceCancel}
            </Hov>
            <Hov
              as="button"
              type="button"
              disabled={linking}
              onClick={() => void linkWallet(true)}
              style="appearance:none;cursor:pointer;flex:1;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:12px;font:600 13px var(--font-hanken)"
              hover="background:#000"
            >
              {linking ? buy.depositLinkWalletLoading : buy.depositLinkWalletReplaceCta}
            </Hov>
          </div>
        </>
      ) : linkDone ? (
        <p style={css("font:500 13px var(--font-hanken);color:var(--accent,#0E8C6A);margin:0")}>✓ {buy.depositLinkWalletDone}</p>
      ) : (
        <>
          <p style={css("font:600 14px var(--font-hanken);color:#0D0D0D;margin:0 0 6px")}>{buy.depositLinkWalletTitle}</p>
          <p style={css("font:400 13px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 12px")}>{buy.depositLinkWalletHint}</p>
          <Hov
            as="button"
            type="button"
            disabled={linking}
            onClick={() => void linkWallet(false)}
            style="appearance:none;cursor:pointer;width:100%;background:#fff;color:#0D0D0D;border:1px solid #E6E6E8;border-radius:12px;padding:12px;font:600 13px var(--font-hanken)"
            hover="border-color:#0D0D0D"
          >
            {linking ? buy.depositLinkWalletLoading : buy.depositLinkWalletCta}
          </Hov>
        </>
      )}
      {error ? <p style={css("font:500 13px var(--font-hanken);color:#D14343;margin:10px 0 0")}>{error}</p> : null}
    </div>
  );
}
