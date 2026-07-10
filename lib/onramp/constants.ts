import { brandLegal } from "@/lib/brand-legal";
import { legalConfig } from "@/lib/legal.config";
import { getActiveNumberLocale } from "@/lib/i18n/runtime";

/** Metadata WalletConnect / Reown (wagmi walletConnect connector). */
/**
 * La URL de metadata DEBE coincidir con el origen desde el que se sirve la
 * dapp: si no coincide, Reown/WalletConnect la marca como "unverified" y
 * wallets como MetaMask pueden avisar o rechazar la sesión. En el navegador
 * usamos el origen real (cubre producción, previews y localhost); en SSR el
 * dominio canónico (el conector solo opera en cliente).
 * La descripción se muestra dentro de apps de wallet de todo el mundo → en inglés.
 */
const wcOrigin =
  typeof window !== "undefined" ? window.location.origin : legalConfig.siteUrl;

export const WALLET_CONNECT_METADATA = {
  name: brandLegal.productBrand,
  description: "Get OPEN on the Base network with your wallet.",
  url: wcOrigin,
  icons: [`${wcOrigin}/favicon.png`],
} as const;

/** USDC en Base (solo uso interno; no mostrar al usuario). */
export const USDC_BASE = {
  address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const,
  decimals: 6,
};

/** Decimales del token OPEN (ajustable si el contrato usa otro valor). */
export const OPEN_TOKEN_DECIMALS = Number(process.env.NEXT_PUBLIC_OPEN_DECIMALS ?? "18");

export function formatUsdcBalance(amount: number): string {
  return `${amount.toLocaleString(getActiveNumberLocale(), { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
}
