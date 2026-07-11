import { type NextRequest, NextResponse } from "next/server";
import { supabaseService, depositAuthEnvMissing } from "@/lib/deposits/server";
import { createAuthClient } from "@/lib/supabase/auth-client";
import { siteOrigin } from "@/lib/deposits/my-purchase";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

/**
 * POST /api/purchase-magic-link
 * Body: { email }
 * Envía magic link de Supabase Auth si existe un buyer con ese email.
 */
export async function POST(req: NextRequest) {
  const missing = depositAuthEnvMissing();
  if (missing.length > 0) {
    return NextResponse.json({ error: "servidor no configurado", missing }, { status: 503 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "cuerpo inválido" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "email inválido" }, { status: 400 });
  }

  try {
    const supabase = supabaseService();
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    const { count } = await supabase
      .from("purchase_magic_requests")
      .select("id", { count: "exact", head: true })
      .eq("email", email)
      .gte("created_at", since);
    if ((count ?? 0) >= RATE_LIMIT) {
      return NextResponse.json({ error: "demasiados intentos" }, { status: 429 });
    }

    const { data: buyer } = await supabase
      .from("presale_buyers")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (!buyer) {
      return NextResponse.json({ error: "compra no encontrada" }, { status: 404 });
    }

    await supabase.from("purchase_magic_requests").insert({ email });

    const origin = siteOrigin(req);
    const auth = createAuthClient();
    const { error } = await auth.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/mi-compra`,
      },
    });
    if (error) {
      console.error("[purchase-magic-link] otp", error);
      return NextResponse.json({ error: "no se pudo enviar el enlace" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[purchase-magic-link]", err);
    return NextResponse.json({ error: "error interno" }, { status: 500 });
  }
}
