import { type NextRequest, NextResponse } from "next/server";
import { supabaseService, verifyBuyerToken, BUYER_COOKIE, depositEnvMissing } from "@/lib/deposits/server";

/**
 * GET /api/deposit-status
 * Identifica al comprador por la cookie firmada (set en /api/deposit-address).
 * Devuelve dirección, USDC pendientes/acreditados y OPEN estimados.
 * 401 sin cookie = comprador aún no registrado (esperado en primera visita).
 */
export async function GET(req: NextRequest) {
  const missing = depositEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "servidor no configurado", missing },
      { status: 503 }
    );
  }

  try {
    return await handleDepositStatus(req);
  } catch (err) {
    console.error("[deposit-status]", err);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}

async function handleDepositStatus(req: NextRequest) {
  const token = req.cookies.get(BUYER_COOKIE)?.value;
  const buyerId = verifyBuyerToken(token);
  if (!buyerId) {
    return NextResponse.json({ error: "no registrado" }, { status: 401 });
  }

  const supabase = supabaseService();

  const { data: buyer } = await supabase
    .from("presale_buyers")
    .select("deposit_address, claim_address")
    .eq("id", buyerId)
    .maybeSingle();
  if (!buyer) {
    return NextResponse.json({ error: "no registrado" }, { status: 401 });
  }

  const [{ data: deposits }, { data: config }] = await Promise.all([
    supabase
      .from("presale_deposits")
      .select("amount_usdc, status")
      .eq("buyer_id", buyerId),
    supabase.from("presale_config").select("open_per_usdc").single(),
  ]);

  let credited = 0;
  let pending = 0;
  for (const d of deposits ?? []) {
    const amount = Number(d.amount_usdc);
    if (d.status === "credited" || d.status === "swept" || d.status === "bridged") {
      credited += amount;
    } else if (d.status === "detected" || d.status === "confirmed") {
      pending += amount;
    }
  }

  const openPerUsdc = Number(config?.open_per_usdc ?? 0);

  return NextResponse.json({
    depositAddress: buyer.deposit_address,
    claimAddress: buyer.claim_address ?? null,
    hasClaimAddress: Boolean(buyer.claim_address),
    credited,
    pending,
    openEstimated: credited * openPerUsdc,
  });
}
