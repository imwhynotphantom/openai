"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { css } from "@/lib/css";
import { ACCENT } from "@/lib/format";
import { Hov } from "@/components/ui";
import { useBuyCopy } from "@/hooks/useBuyCopy";
import { useHasPurchase } from "@/hooks/useHasPurchase";
import { CopyAddressButton, InfoBanner } from "../ui/CopyAddressButton";
import { DepositOpenCalculator } from "../ui/DepositOpenCalculator";

type DepositInfo = {
  depositAddress: string;
  hasClaimAddress: boolean;
  credited: number;
  pending: number;
  openPerUsdc: number;
  openEstimated: number;
  pendingOpenEstimated: number;
};

type ExchangeId = "binance" | "bit2me" | "kraken" | "wallet";

const fmt = (n: number) => n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

function DepositAddressPulse() {
  return (
    <span
      data-deposit-pulse
      aria-hidden
      style={css(
        "position:relative;display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;flex-shrink:0"
      )}
    >
      <span
        style={css(
          "position:absolute;inset:-3px;border-radius:50%;border:2px solid " +
            ACCENT +
            ";animation:hubring 2.2s ease-out infinite"
        )}
      />
      <span
        style={css(
          "width:11px;height:11px;border-radius:50%;background:" +
            ACCENT +
            ";box-shadow:0 0 0 4px color-mix(in srgb, " +
            ACCENT +
            " 18%, transparent)"
        )}
      />
    </span>
  );
}

export function DepositTab({ address }: { address?: `0x${string}` }) {
  const buy = useBuyCopy();
  const { refreshPurchase } = useHasPurchase();
  const [info, setInfo] = useState<DepositInfo | null>(null);
  const [needsRegister, setNeedsRegister] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchange, setExchange] = useState<ExchangeId | null>(null);

  const EXCHANGES: { id: ExchangeId; name: string; steps: string[] }[] = [
    { id: "binance", name: "Binance", steps: buy.depositStepsBinance },
    { id: "bit2me", name: "Bit2Me", steps: buy.depositStepsBit2me },
    { id: "kraken", name: "Kraken", steps: buy.depositStepsKraken },
    { id: "wallet", name: buy.depositOtherWallet, steps: buy.depositStepsWallet },
  ];

  const loadStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/deposit-status", { cache: "no-store" });
      if (r.status === 401) {
        setNeedsRegister(true);
        return false;
      }
      if (!r.ok) return false;
      setInfo(await r.json());
      setNeedsRegister(false);
      return true;
    } catch {
      return false;
    }
  }, []);

  const register = useCallback(async () => {
    setRegistering(true);
    setError(null);
    try {
      const r = await fetch("/api/deposit-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimAddress: address }),
      });
      if (!r.ok) {
        const data = (await r.json().catch(() => ({}))) as { error?: string };
        if (r.status === 503) throw new Error("server_config");
        throw new Error(data.error ?? "register failed");
      }
      await loadStatus();
      await refreshPurchase();
    } catch (e) {
      setError(e instanceof Error && e.message === "server_config" ? buy.depositServerUnavailable : buy.depositError);
    } finally {
      setRegistering(false);
    }
  }, [address, buy.depositError, buy.depositServerUnavailable, loadStatus, refreshPurchase]);

  useEffect(() => {
    let alive = true;
    let id: ReturnType<typeof setInterval> | undefined;
    void loadStatus().then(() => {
      if (!alive) return;
      id = setInterval(() => void loadStatus(), 15_000);
    });
    return () => {
      alive = false;
      if (id) clearInterval(id);
    };
  }, [loadStatus]);

  useEffect(() => {
    if (needsRegister && !registering && !error) {
      void register();
    }
  }, [needsRegister, registering, error, register]);

  const exchangeSelector = (
    <>
      <p style={css("font:600 12px var(--font-hanken);color:#8A8A94;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.04em")}>
        {buy.depositFromWhere}
      </p>
      <div style={css("display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px")}>
        {EXCHANGES.map((e) => (
          <Hov
            key={e.id}
            as="button"
            type="button"
            onClick={() => setExchange(e.id)}
            style={
              exchange === e.id
                ? "appearance:none;cursor:pointer;padding:9px 14px;border-radius:999px;border:1px solid #0D0D0D;background:#0D0D0D;color:#fff;font:600 13px var(--font-hanken)"
                : "appearance:none;cursor:pointer;padding:9px 14px;border-radius:999px;border:1px solid #E6E6E8;background:#fff;color:#5C5C66;font:600 13px var(--font-hanken)"
            }
            hover={exchange === e.id ? undefined : "border-color:#0D0D0D;color:#0D0D0D"}
          >
            {e.name}
          </Hov>
        ))}
      </div>
      {EXCHANGES.find((e) => e.id === exchange) ? (
        <ol style={css("margin:0 0 16px;padding:14px 16px;list-style:none;border-radius:12px;background:#F7F7F8")}>
          {EXCHANGES.find((e) => e.id === exchange)!.steps.map((s, i) => (
            <li key={i} style={css("display:flex;gap:10px;font:400 13.5px/1.55 var(--font-hanken);color:#5C5C66;margin-bottom:4px")}>
              <span style={css("font:600 12px var(--font-mono);color:#8A8A94;padding-top:2px")}>{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </>
  );

  if (needsRegister) {
    return (
      <div>
        <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>{buy.depositIntro}</p>
        <DepositOpenCalculator />
        {exchangeSelector}
        <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA;text-align:center;margin-bottom:16px")}>
          <p style={css("font:600 15px var(--font-hanken);color:#0D0D0D;margin:0 0 8px")}>{buy.depositRegisterTitle}</p>
          <p style={css("font:400 13px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 14px")}>
            {address ? buy.depositRegisterHintWallet : buy.depositRegisterHint}
          </p>
          {registering ? (
            <p style={css("font:500 14px var(--font-hanken);color:#8A8A94;margin:0")}>{buy.depositRegisterLoading}</p>
          ) : (
            <Hov
              as="button"
              type="button"
              onClick={register}
              style="appearance:none;cursor:pointer;width:100%;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:14px;font:600 14px var(--font-hanken)"
              hover="background:#000"
            >
              {buy.depositRegisterCta}
            </Hov>
          )}
          {error ? <p style={css("font:500 13px var(--font-hanken);color:#D14343;margin:10px 0 0")}>{error}</p> : null}
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div>
        <p style={css("font:400 14px var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>{buy.depositRegisterLoading}</p>
        <DepositOpenCalculator />
      </div>
    );
  }

  const summaryText =
    info.credited > 0
      ? buy.depositCreditedBanner(fmt(info.credited), fmt(info.openEstimated))
      : info.pending > 0
        ? buy.depositPendingBanner(fmt(info.pending), fmt(info.pendingOpenEstimated))
        : buy.depositMyPurchaseSummaryEmpty;

  return (
    <div>
      <div style={css("display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-radius:12px;background:#F7F7F8;border:1px solid #ECECEC;margin-bottom:16px")}>
        <div>
          <p style={css("font:600 13px var(--font-hanken);color:#0D0D0D;margin:0 0 4px")}>{buy.depositMyPurchaseBar}</p>
          <p style={css("font:500 12.5px/1.45 var(--font-hanken);color:#5C5C66;margin:0")}>{summaryText}</p>
        </div>
        <Link
          href="/mi-compra"
          style={css("font:600 13px var(--font-hanken);color:#fff;background:#0D0D0D;text-decoration:none;padding:10px 14px;border-radius:10px;white-space:nowrap")}
        >
          {buy.depositViewMyPurchase}
        </Link>
      </div>

      <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>{buy.depositIntro}</p>

      <DepositOpenCalculator openPerUsdc={info.openPerUsdc} />

      {exchangeSelector}

      <div
        data-deposit-address-card
        style={css(
          "padding:clamp(16px, 4vw, 22px);border:2px solid color-mix(in srgb, " +
            ACCENT +
            " 42%, #ECECEC);border-radius:16px;background:color-mix(in srgb, " +
            ACCENT +
            " 6%, #fff);text-align:center;margin-bottom:16px"
        )}
      >
        <div
          data-deposit-address-heading
          style={css(
            "display:flex;align-items:center;justify-content:center;gap:10px;margin:0 0 clamp(14px, 3.5vw, 18px);flex-wrap:wrap"
          )}
        >
          <DepositAddressPulse />
          <p
            data-deposit-address-label
            style={css(
              "font:700 clamp(15px, 4.2vw, 20px)/1.25 var(--font-hanken);color:" +
                ACCENT +
                ";margin:0;text-transform:uppercase;letter-spacing:0.04em;text-align:center;max-width:100%"
            )}
          >
            {buy.depositAddressLabel}
          </p>
        </div>
        <div style={css("display:flex;justify-content:center;margin-bottom:clamp(12px, 3vw, 16px)")}>
          <QRCodeSVG value={info.depositAddress} size={148} />
        </div>
        <p
          data-deposit-address-value
          style={css(
            "font:600 clamp(12px, 3.2vw, 15px)/1.45 var(--font-mono);color:#0D0D0D;margin:0 0 14px;word-break:break-all;padding:12px 14px;border-radius:12px;background:#fff;border:1px solid #ECECEC"
          )}
        >
          {info.depositAddress}
        </p>
        <CopyAddressButton value={info.depositAddress} />
      </div>

      <div style={css("padding:10px 12px;border-radius:10px;background:#FFF7ED;border:1px solid #FBD9A5;font:500 12.5px/1.5 var(--font-hanken);color:#9A5B00;margin:0 0 16px")}>
        {buy.depositNetworkWarning}
      </div>

      {info.pending > 0 ? (
        <div style={css("display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:#EFF5FD;border:1px solid #C4D9F2;margin:0 0 12px")}>
          <span style={css("width:9px;height:9px;border-radius:50%;background:#2F6FBF;animation:deposit-pulse 1.2s ease-in-out infinite")} />
          <span style={css("font:500 13px/1.4 var(--font-hanken);color:#2F5D96")}>
            {buy.depositPendingBanner(fmt(info.pending), fmt(info.pendingOpenEstimated))}
          </span>
        </div>
      ) : null}

      {info.credited > 0 ? (
        <div style={css("padding:12px 14px;border-radius:12px;background:color-mix(in srgb, var(--accent, #0E8C6A) 9%, #fff);border:1px solid color-mix(in srgb, var(--accent, #0E8C6A) 35%, #fff);margin:0 0 12px")}>
          <p style={css("font:500 13px/1.5 var(--font-hanken);color:var(--accent,#0E8C6A);margin:0 0 6px")}>
            ✓ {buy.depositCreditedBanner(fmt(info.credited), fmt(info.openEstimated))}
          </p>
          <Link href="/mi-compra" style={css("font:600 13px var(--font-hanken);color:#0D0D0D;text-decoration:underline")}>
            {buy.depositViewMyPurchase}
          </Link>
        </div>
      ) : null}

      {info.credited === 0 && info.pending === 0 ? (
        <div style={css("margin:0 0 12px")}>
          <InfoBanner message={buy.depositWaiting} />
        </div>
      ) : null}

      <style>{`@keyframes deposit-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </div>
  );
}
