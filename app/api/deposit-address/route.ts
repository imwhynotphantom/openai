import { type NextRequest, NextResponse } from "next/server";
import { keccak256, toHex, getContractAddress, isAddress, getAddress } from "viem";
import { FACTORY_ADDRESS, FORWARDER_INIT_CODE_HASH } from "@/lib/deposits/constants";
import { supabaseService, verifyBuyerToken, BUYER_COOKIE, depositEnvMissing, attachBuyerCookie } from "@/lib/deposits/server";
import { readRequestLocale } from "@/lib/deposits/my-purchase";

/**
 * POST /api/deposit-address
 * Body: { email?, claimAddress?, refundAddress? }
 *
 * Crea (o reutiliza) el comprador y devuelve su dirección de depósito única.
 * La dirección es CREATE2: no se despliega nada hasta el primer barrido.
 */
export async function POST(req: NextRequest) {
  const missing = depositEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "servidor no configurado", missing },
      { status: 503 }
    );
  }

  try {
    return await handleDepositAddress(req);
  } catch (err) {
    console.error("[deposit-address]", err);
    return NextResponse.json({ error: "error interno al registrar" }, { status: 500 });
  }
}

async function handleDepositAddress(req: NextRequest) {
  let body: { email?: string; claimAddress?: string; refundAddress?: string } = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === "object") body = parsed;
  } catch {
    /* cuerpo vacío: comprador anónimo */
  }

  const email = body.email?.trim().toLowerCase() || null;
  const claimAddress = body.claimAddress?.trim() || null;
  const refundAddress = body.refundAddress?.trim() || null;

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email inválido" }, { status: 400 });
  }
  if (claimAddress && !isAddress(claimAddress)) {
    return NextResponse.json({ error: "wallet inválida" }, { status: 400 });
  }
  if (refundAddress && !isAddress(refundAddress)) {
    return NextResponse.json({ error: "wallet de devolución inválida" }, { status: 400 });
  }

  const locale = readRequestLocale(req);

  const supabase = supabaseService();

  const cookieBuyerId = verifyBuyerToken(req.cookies.get(BUYER_COOKIE)?.value);
  if (cookieBuyerId) {
    const { data: cookieBuyer } = await supabase
      .from("presale_buyers")
      .select("id, deposit_address, claim_address, refund_address, email, locale")
      .eq("id", cookieBuyerId)
      .maybeSingle();
    if (cookieBuyer) {
      const updates: Record<string, string> = {};
      if (email && !cookieBuyer.email) updates.email = email;
      if (claimAddress && !cookieBuyer.claim_address) {
        const normalized = getAddress(claimAddress);
        const { data: conflict } = await supabase
          .from("presale_buyers")
          .select("id")
          .eq("claim_address", normalized)
          .neq("id", cookieBuyerId)
          .maybeSingle();
        if (conflict) {
          return NextResponse.json({ error: "wallet en uso" }, { status: 409 });
        }
        updates.claim_address = normalized;
        if (!cookieBuyer.refund_address) updates.refund_address = normalized;
      }
      if (refundAddress && !cookieBuyer.refund_address) {
        updates.refund_address = getAddress(refundAddress);
      }
      if (locale && !cookieBuyer.locale) updates.locale = locale;
      if (Object.keys(updates).length > 0) {
        await supabase.from("presale_buyers").update(updates).eq("id", cookieBuyerId);
      }
      return attachBuyerCookie(
        NextResponse.json({ depositAddress: cookieBuyer.deposit_address }),
        cookieBuyerId
      );
    }
  }

  const { data: config } = await supabase
    .from("presale_config")
    .select("deposits_paused")
    .single();
  if (config?.deposits_paused) {
    return NextResponse.json({ error: "preventa completa" }, { status: 409 });
  }

  // Reutilizar si ya existe (por email o por wallet de claim)
  const filters = [
    email ? `email.eq.${email}` : null,
    claimAddress ? `claim_address.eq.${getAddress(claimAddress)}` : null,
  ]
    .filter(Boolean)
    .join(",");
  const { data: existing } = await supabase
    .from("presale_buyers")
    .select("id, deposit_address")
    .or(filters)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return attachBuyerCookie(
      NextResponse.json({ depositAddress: existing.deposit_address }),
      existing.id
    );
  }

  // Crear buyer → salt = keccak256(uuid) → dirección CREATE2 (sin desplegar nada)
  const { data: buyer, error } = await supabase
    .from("presale_buyers")
    .insert({
      email,
      locale,
      claim_address: claimAddress ? getAddress(claimAddress) : null,
      // Si conecta wallet y no da otra, esa misma sirve para devoluciones.
      refund_address: refundAddress
        ? getAddress(refundAddress)
        : claimAddress
          ? getAddress(claimAddress)
          : null,
      // placeholders únicos hasta calcular el salt real con el uuid
      salt: `pending-${crypto.randomUUID()}`,
      deposit_address: `pending-${crypto.randomUUID()}`,
    })
    .select("id")
    .single();
  if (error || !buyer) {
    return NextResponse.json({ error: error?.message ?? "error al registrar" }, { status: 500 });
  }

  const salt = keccak256(toHex(buyer.id));
  const depositAddress = getContractAddress({
    opcode: "CREATE2",
    from: FACTORY_ADDRESS,
    salt,
    bytecodeHash: FORWARDER_INIT_CODE_HASH,
  });

  const { error: updateError } = await supabase
    .from("presale_buyers")
    .update({ salt, deposit_address: depositAddress })
    .eq("id", buyer.id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return attachBuyerCookie(NextResponse.json({ depositAddress }), buyer.id);
}
