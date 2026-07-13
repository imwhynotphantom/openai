"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { css } from "@/lib/css";
import { Hov } from "@/components/ui";
import { useMyPurchaseCopy } from "@/hooks/useMyPurchaseCopy";
import { useBuyCopy } from "@/hooks/useBuyCopy";
import { CopyAddressButton } from "@/components/buy/ui/CopyAddressButton";
import { LinkWalletPanel } from "./LinkWalletPanel";
import { PurchaseRecoveryForm } from "./PurchaseRecoveryForm";
import type { MyPurchaseResponse } from "@/lib/deposits/my-purchase";

const fmt = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

export function MyPurchaseView() {
  const mp = useMyPurchaseCopy();
  const buy = useBuyCopy();
  const [data, setData] = useState<MyPurchaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauth, setUnauth] = useState(false);

  const statusLabel = (status: string): string => {
    // swept/bridged son pasos internos: el comprador solo ve "confirmado"
    if (status === "swept" || status === "bridged" || status === "credited") {
      return mp.statusCredited;
    }
    const map: Record<string, string> = {
      detected: mp.statusDetected,
      confirmed: mp.statusConfirmed,
      refund_pending: mp.statusRefundPending,
      refunded: mp.statusRefunded,
    };
    return map[status] ?? status;
  };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/my-purchase", { cache: "no-store" });
      if (r.status === 401) {
        setUnauth(true);
        setData(null);
        return;
      }
      if (!r.ok) return;
      setData(await r.json());
      setUnauth(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 15_000);
    return () => clearInterval(id);
  }, [load]);

  if (loading) {
    return <p style={css("font:400 14px var(--font-hanken);color:#8A8A94;text-align:center")}>{buy.depositRegisterLoading}</p>;
  }

  if (unauth || !data) {
    return <PurchaseRecoveryForm onAuthenticated={() => { setLoading(true); void load(); }} showBuyLink />;
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  const pendingOpen = data.pending * data.openPerUsdc;

  return (
    <div>
      <div style={css("padding:16px 18px;border-radius:14px;background:#F7F7F8;border:1px solid #ECECEC;margin-bottom:16px")}>
        <p style={css("font:600 12px var(--font-hanken);color:#8A8A94;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.04em")}>
          {mp.statsTitle}
        </p>
        <p style={css("font:600 18px/1.35 var(--font-hanken);color:#0D0D0D;margin:0 0 12px")}>
          {mp.statsRelation(fmt(data.credited), fmt(data.openEstimated))}
        </p>
        <div style={css("display:grid;grid-template-columns:1fr 1fr;gap:12px")}>
          <Stat label={mp.creditedLabel} value={`${fmt(data.credited)} USDC`} large />
          <Stat label={mp.openReservedLabel} value={`${fmt(data.openEstimated)} OPEN`} large />
        </div>
      </div>

      <div style={css("padding:12px 14px;border-radius:12px;background:#FFF7ED;border:1px solid #FBD9A5;margin:0 0 16px")}>
        <span style={css("font:500 13px/1.45 var(--font-hanken);color:#9A5B00")}>{mp.claimNotice}</span>
      </div>

      {data.pending > 0 ? (
        <div style={css("padding:12px 14px;border-radius:12px;background:#EFF5FD;border:1px solid #C4D9F2;margin:0 0 16px")}>
          <span style={css("font:500 13px/1.4 var(--font-hanken);color:#2F5D96")}>
            {mp.pendingBanner(fmt(data.pending), fmt(pendingOpen))}
          </span>
        </div>
      ) : null}

      {!data.hasClaimAddress ? <LinkWalletPanel claimAddress={data.claimAddress} onLinked={load} /> : null}

      <p style={css("font:600 12px var(--font-hanken);color:#8A8A94;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.04em")}>
        {mp.depositHistoryTitle}
      </p>
      {data.deposits.length === 0 ? (
        <p style={css("font:400 13px var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>{buy.depositWaiting}</p>
      ) : (
        <div style={css("border:1px solid #ECECEC;border-radius:12px;overflow:hidden;margin:0 0 16px")}>
          {data.deposits.map((d, i) => (
            <div
              key={d.id}
              style={css(
                `padding:12px 14px;display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center${i < data.deposits.length - 1 ? ";border-bottom:1px solid #F0F0F2" : ""}`
              )}
            >
              <div>
                <p style={css("font:600 13px var(--font-mono);color:#0D0D0D;margin:0 0 2px")}>
                  {fmt(d.amountUsdc)} USDC
                  {d.openEstimated != null ? (
                    <span style={css("font:500 13px var(--font-hanken);color:#5C5C66")}>
                      {" "}
                      {mp.historyOpenLine(fmt(d.openEstimated))}
                    </span>
                  ) : null}
                </p>
                <p style={css("font:400 12px var(--font-hanken);color:#8A8A94;margin:0")}>{formatDate(d.detectedAt)}</p>
                <p style={css("font:500 12px var(--font-hanken);color:#5C5C66;margin:4px 0 0")}>{statusLabel(d.status)}</p>
              </div>
              {d.explorerUrl ? (
                <a
                  href={d.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={css("font:600 12px var(--font-hanken);color:#0D0D0D;text-decoration:underline;white-space:nowrap")}
                >
                  {mp.viewExplorer}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <p style={css("font:600 12px var(--font-hanken);color:#8A8A94;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.04em")}>
        {mp.depositAddressTitle}
      </p>
      <p style={css("font:400 13px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 12px")}>{mp.depositAddressHint}</p>
      <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA;text-align:center;margin-bottom:16px")}>
        <div style={css("display:flex;justify-content:center;margin-bottom:14px")}>
          <QRCodeSVG value={data.depositAddress} size={148} />
        </div>
        <p style={css("font:500 13px var(--font-mono);color:#0D0D0D;margin:0 0 12px;word-break:break-all")}>{data.depositAddress}</p>
        <CopyAddressButton value={data.depositAddress} />
      </div>

      <Hov
        as={Link}
        href="/comprar?modo=recibir"
        style="display:block;text-align:center;appearance:none;cursor:pointer;width:100%;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:14px;font:600 14px var(--font-hanken);text-decoration:none"
        hover="background:#000"
      >
        {mp.buyMoreCta}
      </Hov>
    </div>
  );
}

function Stat({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div style={css("padding:14px;border:1px solid #ECECEC;border-radius:12px;background:#FAFAFA")}>
      <p style={css("font:600 11px var(--font-hanken);color:#8A8A94;margin:0 0 4px")}>{label}</p>
      <p style={css(`font:600 ${large ? "22" : "16"}px var(--font-mono);color:#0D0D0D;margin:0`)}>{value}</p>
    </div>
  );
}
