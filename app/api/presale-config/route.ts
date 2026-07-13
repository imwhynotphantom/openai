import { NextResponse } from "next/server";
import { supabaseService, depositEnvMissing } from "@/lib/deposits/server";
import { MIN_DEPOSIT_USDC, MIN_DEPOSIT_ETH_MAINNET_USDC } from "@/lib/deposits/constants";

/**
 * GET /api/presale-config
 * Tasa pública de preventa por depósito (misma fuente que deposit-status).
 */
export async function GET() {
  const missing = depositEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json({ error: "servidor no configurado", missing }, { status: 503 });
  }

  try {
    const supabase = supabaseService();
    const { data: config } = await supabase.from("presale_config").select("open_per_usdc").single();
    const openPerUsdc = Number(config?.open_per_usdc ?? 0);

    return NextResponse.json({
      openPerUsdc,
      minDepositUsdc: MIN_DEPOSIT_USDC,
      minDepositEthMainnetUsdc: MIN_DEPOSIT_ETH_MAINNET_USDC,
    });
  } catch (err) {
    console.error("[presale-config]", err);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}
