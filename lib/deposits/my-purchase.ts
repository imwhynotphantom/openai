import { type NextRequest, NextResponse } from "next/server";
import { supabaseService, attachBuyerCookie } from "@/lib/deposits/server";
import { LOCALE_COOKIE, isLocale } from "@/lib/i18n/config";

export type PurchaseDeposit = {
  id: string;
  amountUsdc: number;
  status: string;
  detectedAt: string;
  confirmedAt: string | null;
  creditedAt: string | null;
  sweepTx: string | null;
  explorerUrl: string | null;
};

export type MyPurchaseResponse = {
  depositAddress: string;
  claimAddress: string | null;
  hasClaimAddress: boolean;
  email: string | null;
  credited: number;
  pending: number;
  openEstimated: number;
  openPerUsdc: number;
  deposits: PurchaseDeposit[];
};

const BASE_EXPLORER = "https://basescan.org/tx/";

export async function loadMyPurchase(buyerId: string): Promise<MyPurchaseResponse | null> {
  const supabase = supabaseService();

  const { data: buyer } = await supabase
    .from("presale_buyers")
    .select("deposit_address, claim_address, email")
    .eq("id", buyerId)
    .maybeSingle();
  if (!buyer) return null;

  const [{ data: deposits }, { data: config }] = await Promise.all([
    supabase
      .from("presale_deposits")
      .select("id, amount_usdc, status, detected_at, confirmed_at, credited_at, sweep_tx")
      .eq("buyer_id", buyerId)
      .order("detected_at", { ascending: false }),
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

  return {
    depositAddress: buyer.deposit_address,
    claimAddress: buyer.claim_address ?? null,
    hasClaimAddress: Boolean(buyer.claim_address),
    email: buyer.email ?? null,
    credited,
    pending,
    openEstimated: credited * openPerUsdc,
    openPerUsdc,
    deposits: (deposits ?? []).map((d) => ({
      id: d.id,
      amountUsdc: Number(d.amount_usdc),
      status: d.status,
      detectedAt: d.detected_at,
      confirmedAt: d.confirmed_at,
      creditedAt: d.credited_at,
      sweepTx: d.sweep_tx,
      explorerUrl: d.sweep_tx ? `${BASE_EXPLORER}${d.sweep_tx}` : null,
    })),
  };
}

export function readRequestLocale(req: NextRequest): string | null {
  const raw = req.cookies.get(LOCALE_COOKIE)?.value;
  return raw && isLocale(raw) ? raw : null;
}

export function siteOrigin(req: NextRequest | Request): string {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.openaiprotocol.com";
}

export function attachBuyerJson(buyerId: string, body: object = { ok: true }) {
  return attachBuyerCookie(NextResponse.json(body), buyerId);
}
