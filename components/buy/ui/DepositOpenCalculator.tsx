"use client";

import { useEffect, useMemo, useState } from "react";
import { css } from "@/lib/css";
import { Hov } from "@/components/ui";
import { useBuyCopy } from "@/hooks/useBuyCopy";
import { MIN_DEPOSIT_USDC } from "@/lib/deposits/constants";

const QUICK_USDC = [1000, 5000, 10000];

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

type Props = {
  openPerUsdc?: number;
};

export function DepositOpenCalculator({ openPerUsdc: openPerUsdcProp }: Props) {
  const buy = useBuyCopy();
  const [amountInput, setAmountInput] = useState("");
  const [openPerUsdc, setOpenPerUsdc] = useState(openPerUsdcProp ?? 0);
  const [loadingRate, setLoadingRate] = useState(openPerUsdcProp === undefined);

  useEffect(() => {
    if (openPerUsdcProp !== undefined && openPerUsdcProp > 0) {
      setOpenPerUsdc(openPerUsdcProp);
      setLoadingRate(false);
      return;
    }
    let alive = true;
    void fetch("/api/presale-config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { openPerUsdc?: number } | null) => {
        if (!alive || !data?.openPerUsdc) return;
        setOpenPerUsdc(data.openPerUsdc);
      })
      .finally(() => {
        if (alive) setLoadingRate(false);
      });
    return () => {
      alive = false;
    };
  }, [openPerUsdcProp]);

  const usdcAmount = useMemo(() => {
    const raw = amountInput.trim().replace(",", ".");
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [amountInput]);

  const openEstimated = usdcAmount != null && openPerUsdc > 0 ? usdcAmount * openPerUsdc : null;
  const belowMin = usdcAmount != null && usdcAmount > 0 && usdcAmount < MIN_DEPOSIT_USDC;

  return (
    <div style={css("padding:16px;border:1px solid #ECECEC;border-radius:14px;background:#FAFAFA;margin-bottom:16px")}>
      <p style={css("font:600 14px var(--font-hanken);color:#0D0D0D;margin:0 0 4px")}>{buy.depositCalcTitle}</p>
      <p style={css("font:400 13px/1.45 var(--font-hanken);color:#8A8A94;margin:0 0 14px")}>{buy.depositAmountReminder}</p>

      <label style={css("font:600 12px var(--font-hanken);color:#5C5C66;display:block;margin-bottom:6px")}>
        {buy.depositCalcLabel}
      </label>
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="0,00"
        aria-label={buy.depositCalcLabel}
        value={amountInput}
        onChange={(e) => setAmountInput(e.target.value)}
        style={css(
          `width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid ${belowMin ? "#E5A0A0" : "#E6E6E8"};border-radius:12px;font:500 15px var(--font-mono);margin-bottom:8px`
        )}
      />

      <div style={css("display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px")}>
        {QUICK_USDC.map((v) => {
          const selected = usdcAmount === v;
          return (
            <Hov
              key={v}
              as="button"
              type="button"
              onClick={() => setAmountInput(String(v))}
              style={
                selected
                  ? "appearance:none;cursor:pointer;padding:7px 12px;border-radius:999px;border:1px solid #0D0D0D;background:#0D0D0D;color:#fff;font:600 12px var(--font-mono)"
                  : "appearance:none;cursor:pointer;padding:7px 12px;border-radius:999px;border:1px solid #E6E6E8;background:#fff;color:#5C5C66;font:600 12px var(--font-mono)"
              }
              hover={selected ? undefined : "border-color:#0D0D0D;color:#0D0D0D"}
            >
              {v.toLocaleString()}
            </Hov>
          );
        })}
      </div>

      {openEstimated != null ? (
        <p style={css("font:600 15px var(--font-hanken);color:var(--accent,#0E8C6A);margin:0 0 8px")}>
          {buy.depositCalcResult(fmt(usdcAmount!), fmt(openEstimated))}
        </p>
      ) : loadingRate ? (
        <p style={css("font:400 13px var(--font-hanken);color:#8A8A94;margin:0 0 8px")}>{buy.depositRegisterLoading}</p>
      ) : null}

      {belowMin ? (
        <p style={css("font:500 12px var(--font-hanken);color:#D14343;margin:0 0 6px")}>
          {buy.depositCalcMinHint(String(MIN_DEPOSIT_USDC))}
        </p>
      ) : (
        <p style={css("font:400 12px/1.45 var(--font-hanken);color:#8A8A94;margin:0")}>
          {buy.depositCalcMinHint(String(MIN_DEPOSIT_USDC))}
        </p>
      )}
    </div>
  );
}
