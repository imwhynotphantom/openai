"use client";

import { useMemo } from "react";
import { useAccount, useReadContracts } from "wagmi";
import { base } from "wagmi/chains";
import { formatUnits } from "viem";
import { getPresaleContract, PRESALE_ABI } from "@/lib/onramp/presale-contract";
import { USDC_BASE } from "@/lib/onramp/constants";

/** Umbral de elegibilidad en USDC (debe coincidir con MIN_REFERRER_USDC del contrato). */
export const REFERRAL_MIN_USD = 1_000;

export type ReferralStats = {
  /** true si puede generar bonus con su link (aporte >= 1.000 USDC o equipo). */
  isEligible: boolean;
  /** USD aportados hasta ahora (número entero aproximado para la UI). */
  contributedUSD: number;
  /** OPEN ganados como referidor (unidades enteras de token). */
  earnedOpen: number;
  /** Número de compras referidas. */
  count: number;
  isLoading: boolean;
  /** false si no hay contrato configurado (preventa aún no desplegada). */
  available: boolean;
};

export function useReferralStats(): ReferralStats {
  const { address } = useAccount();
  const presale = getPresaleContract();

  const { data, isLoading } = useReadContracts({
    contracts: address && presale
      ? ([
          { address: presale, abi: PRESALE_ABI, functionName: "isEligibleReferrer", args: [address], chainId: base.id },
          { address: presale, abi: PRESALE_ABI, functionName: "contributedUSDC", args: [address], chainId: base.id },
          { address: presale, abi: PRESALE_ABI, functionName: "referralEarnedOpen", args: [address], chainId: base.id },
          { address: presale, abi: PRESALE_ABI, functionName: "referralCount", args: [address], chainId: base.id },
        ] as const)
      : [],
    query: { enabled: Boolean(address && presale), refetchInterval: 30_000 },
  });

  return useMemo(() => {
    const [eligible, contributed, earned, count] = data ?? [];
    return {
      isEligible: eligible?.result === true,
      contributedUSD:
        contributed?.result !== undefined
          ? Number(formatUnits(contributed.result as bigint, USDC_BASE.decimals))
          : 0,
      earnedOpen:
        earned?.result !== undefined ? Number(formatUnits(earned.result as bigint, 18)) : 0,
      count: count?.result !== undefined ? Number(count.result as bigint) : 0,
      isLoading,
      available: Boolean(presale),
    };
  }, [data, isLoading, presale]);
}
