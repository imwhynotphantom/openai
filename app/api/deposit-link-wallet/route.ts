import { type NextRequest, NextResponse } from "next/server";
import { getAddress, isAddress } from "viem";
import { supabaseService, verifyBuyerToken, BUYER_COOKIE } from "@/lib/deposits/server";

/**
 * POST /api/deposit-link-wallet
 * Body: { claimAddress }
 *
 * Vincula la wallet conectada al comprador identificado por cookie (p. ej. registro solo-email).
 */
export async function POST(req: NextRequest) {
  const buyerId = verifyBuyerToken(req.cookies.get(BUYER_COOKIE)?.value);
  if (!buyerId) {
    return NextResponse.json({ error: "no registrado" }, { status: 401 });
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
  const normalized = getAddress(claimAddress);

  const supabase = supabaseService();

  const { data: buyer } = await supabase
    .from("presale_buyers")
    .select("claim_address, refund_address")
    .eq("id", buyerId)
    .maybeSingle();
  if (!buyer) {
    return NextResponse.json({ error: "no registrado" }, { status: 401 });
  }
  if (buyer.claim_address) {
    return NextResponse.json({ error: "ya vinculada" }, { status: 409 });
  }

  const { data: conflict } = await supabase
    .from("presale_buyers")
    .select("id")
    .eq("claim_address", normalized)
    .neq("id", buyerId)
    .maybeSingle();
  if (conflict) {
    return NextResponse.json({ error: "wallet en uso" }, { status: 409 });
  }

  const { error } = await supabase
    .from("presale_buyers")
    .update({
      claim_address: normalized,
      refund_address: buyer.refund_address ?? normalized,
    })
    .eq("id", buyerId);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
