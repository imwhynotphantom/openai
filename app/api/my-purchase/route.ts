import { type NextRequest, NextResponse } from "next/server";
import { loadMyPurchase } from "@/lib/deposits/my-purchase";
import { buyerIdFromRequest, depositEnvMissing } from "@/lib/deposits/server";

export type { MyPurchaseResponse } from "@/lib/deposits/my-purchase";

/**
 * GET /api/my-purchase
 * Panel completo de compra — solo con cookie firmada op_buyer.
 */
export async function GET(req: NextRequest) {
  const missing = depositEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json({ error: "servidor no configurado", missing }, { status: 503 });
  }

  const buyerId = buyerIdFromRequest(req);
  if (!buyerId) {
    return NextResponse.json({ error: "no autenticado" }, { status: 401 });
  }

  try {
    const data = await loadMyPurchase(buyerId);
    if (!data) {
      return NextResponse.json({ error: "no registrado" }, { status: 401 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("[my-purchase]", err);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}
