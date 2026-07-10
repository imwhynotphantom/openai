"use client";

import { useAccount, useWatchAsset } from "wagmi";
import { css } from "@/lib/css";
import { useApp } from "@/lib/store";
import { useI18n } from "@/lib/i18n/LocaleProvider";
import { OPEN_TOKEN_DECIMALS } from "@/lib/onramp/constants";

/**
 * Botón "Añadir OPEN a la wallet" (EIP-747 wallet_watchAsset).
 * La wallet muestra su propio diálogo de confirmación; si el usuario acepta,
 * el token queda visible con símbolo, decimales y logo.
 */
export function AddOpenToWallet({ variant = "outline" }: { variant?: "outline" | "ghost" }) {
  const { isConnected } = useAccount();
  const { watchAssetAsync, isPending } = useWatchAsset();
  const app = useApp();
  const { t } = useI18n();

  const token = process.env.NEXT_PUBLIC_OPEN_TOKEN?.trim();
  if (!token || !isConnected) return null;

  const add = async () => {
    try {
      const ok = await watchAssetAsync({
        type: "ERC20",
        options: {
          address: token,
          symbol: "OPEN",
          decimals: OPEN_TOKEN_DECIMALS,
          image: typeof window !== "undefined" ? window.location.origin + "/logo.png" : undefined,
        },
      });
      if (ok) app.toastMsg(t.portfolio.addTokenAdded);
    } catch {
      // Rechazado por el usuario o wallet sin soporte: no es un error de la app.
    }
  };

  const style =
    variant === "outline"
      ? "appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:#fff;color:#0D0D0D;border:1px solid #DADADD;border-radius:12px;padding:12px 18px;font:600 15px var(--font-hanken)"
      : "appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px;background:none;color:#5C5C66;border:none;padding:8px 4px;font:600 13px var(--font-hanken);text-decoration:underline";

  return (
    <button type="button" onClick={() => void add()} disabled={isPending} style={css(style)}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8" />
        <path d="M8 12h8" />
      </svg>
      {isPending ? t.portfolio.addTokenPending : t.portfolio.addTokenCta}
    </button>
  );
}
