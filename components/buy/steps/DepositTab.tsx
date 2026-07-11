"use client";

import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { css } from "@/lib/css";
import { Hov } from "@/components/ui";
import { useBuyCopy } from "@/hooks/useBuyCopy";
import { CopyAddressButton, InfoBanner } from "../ui/CopyAddressButton";

/**
 * Tab "Enviar USDC": cada comprador recibe una dirección de depósito única
 * (CREATE2). Puede enviar USDC desde cualquier wallet o exchange por la red
 * Base; el watcher del backend detecta, acredita y barre a tesorería.
 * Vía ADICIONAL: no toca el flujo on-chain approve+buy.
 */

type DepositInfo = {
  depositAddress: string;
  credited: number; // USDC acreditados
  pending: number; // detectados sin confirmar
  openEstimated: number;
};

type ExchangeId = "binance" | "bit2me" | "kraken" | "wallet";

const fmt = (n: number) =>
  n.toLocaleString("es-ES", { maximumFractionDigits: 2 });

export function DepositTab({ address }: { address?: `0x${string}` }) {
  const buy = useBuyCopy();
  const [info, setInfo] = useState<DepositInfo | null>(null);
  const [needsRegister, setNeedsRegister] = useState(false);
  const [email, setEmail] = useState("");
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

  // Polling del estado cada 15 s — el backend ya vigila la blockchain,
  // aquí solo leemos nuestro ledger.
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

  const register = async () => {
    setRegistering(true);
    setError(null);
    try {
      const r = await fetch("/api/deposit-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimAddress: address,
          email: email.trim() || undefined,
        }),
      });
      if (!r.ok) throw new Error("register failed");
      await loadStatus();
    } catch {
      setError(buy.depositError);
    } finally {
      setRegistering(false);
    }
  };

  // ── Registro previo (una sola vez; después queda la cookie) ──
  if (needsRegister) {
    return (
      <div>
        <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>
          {buy.depositIntro}
        </p>
        <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA")}>
          <p style={css("font:600 15px var(--font-hanken);color:#0D0D0D;margin:0 0 6px")}>
            {buy.depositRegisterTitle}
          </p>
          <p style={css("font:400 13px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 14px")}>
            {buy.depositRegisterHint}
          </p>
          <input
            type="email"
            autoComplete="email"
            placeholder={buy.depositEmailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={css(
              "width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #E6E6E8;border-radius:12px;font:500 14px var(--font-hanken);margin-bottom:12px;background:#fff"
            )}
          />
          <Hov
            as="button"
            type="button"
            disabled={registering || !address}
            onClick={register}
            style="appearance:none;cursor:pointer;width:100%;background:#0D0D0D;color:#fff;border:none;border-radius:12px;padding:14px;font:600 14px var(--font-hanken)"
            hover="background:#000"
          >
            {registering ? buy.depositRegisterLoading : buy.depositRegisterCta}
          </Hov>
          {error ? (
            <p style={css("font:500 13px var(--font-hanken);color:#D14343;margin:10px 0 0")}>{error}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <p style={css("font:400 14px var(--font-hanken);color:#8A8A94;margin:0")}>
        {buy.depositRegisterLoading}
      </p>
    );
  }

  const selected = EXCHANGES.find((e) => e.id === exchange);

  return (
    <div>
      <p style={css("font:400 14px/1.5 var(--font-hanken);color:#8A8A94;margin:0 0 16px")}>
        {buy.depositIntro}
      </p>

      {/* Selector de origen */}
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

      {/* Pasos específicos del origen elegido */}
      {selected ? (
        <ol style={css("margin:0 0 16px;padding:14px 16px;list-style:none;border-radius:12px;background:#F7F7F8")}>
          {selected.steps.map((s, i) => (
            <li key={i} style={css("display:flex;gap:10px;font:400 13.5px/1.55 var(--font-hanken);color:#5C5C66;margin-bottom:4px")}>
              <span style={css("font:600 12px var(--font-mono);color:#8A8A94;padding-top:2px")}>{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      ) : null}

      {/* Dirección + QR */}
      <div style={css("padding:18px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA;text-align:center;margin-bottom:16px")}>
        <div style={css("display:flex;justify-content:center;margin-bottom:14px")}>
          <QRCodeSVG value={info.depositAddress} size={148} />
        </div>
        <p style={css("font:600 11px var(--font-hanken);color:#8A8A94;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.04em")}>
          {buy.depositAddressLabel}
        </p>
        <p style={css("font:500 13px var(--font-mono);color:#0D0D0D;margin:0 0 12px;word-break:break-all")}>
          {info.depositAddress}
        </p>
        <CopyAddressButton value={info.depositAddress} />
      </div>

      {/* Aviso de red (Etapa 1: solo Base) */}
      <div
        style={css(
          "padding:10px 12px;border-radius:10px;background:#FFF7ED;border:1px solid #FBD9A5;font:500 12.5px/1.5 var(--font-hanken);color:#9A5B00;margin:0 0 16px"
        )}
      >
        {buy.depositNetworkWarning}
      </div>

      {/* Estado */}
      {info.pending > 0 ? (
        <div
          style={css(
            "display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:#EFF5FD;border:1px solid #C4D9F2;margin:0 0 12px"
          )}
        >
          <span
            style={css(
              "width:9px;height:9px;border-radius:50%;background:#2F6FBF;animation:deposit-pulse 1.2s ease-in-out infinite"
            )}
          />
          <span style={css("font:500 13px/1.4 var(--font-hanken);color:#2F5D96")}>
            {buy.depositPendingBanner(fmt(info.pending))}
          </span>
        </div>
      ) : null}

      {info.credited > 0 ? (
        <div
          style={css(
            "padding:12px 14px;border-radius:12px;background:color-mix(in srgb, var(--accent, #0E8C6A) 9%, #fff);border:1px solid color-mix(in srgb, var(--accent, #0E8C6A) 35%, #fff);margin:0 0 12px"
          )}
        >
          <span style={css("font:500 13px/1.5 var(--font-hanken);color:var(--accent,#0E8C6A)")}>
            ✓ {buy.depositCreditedBanner(fmt(info.credited), fmt(info.openEstimated))}
          </span>
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
