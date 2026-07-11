import { type NextRequest, NextResponse } from "next/server";
import { getAddress, isAddress } from "viem";
import { supabaseService, depositEnvMissing, attachBuyerCookie } from "@/lib/deposits/server";

/**
 * POST /api/purchase-wallet-auth
 * Body: { claimAddress } — dirección conectada vía wagmi.
 * Recupera acceso para buyers registrados solo con wallet.
 */
export async function POST(req: NextRequest) {
  const missing = depositEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json({ error: "servidor no configurado", missing }, { status: 503 });
  }

  let body: { claimAddress?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  const claimAddress = body.claimAddress?.trim();
  if (!claimAddress || !isAddress(claimAddress)) {
    return NextResponse.json({ error: "wallet inválida" }, { status: 400 });
  }

  try {
    const normalized = getAddress(claimAddress);
    const { data: buyer } = await supabaseService()
      .from("presale_buyers")
      .select("id")
      .eq("claim_address", normalized)
      .maybeSingle();
    if (!buyer) {
      return NextResponse.json({ error: "compra no encontrada" }, { status: 404 });
    }

    return attachBuyerCookie(NextResponse.json({ ok: true }), buyer.id);
  } catch (err) {
    console.error("[purchase-wallet-auth]", err);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}
