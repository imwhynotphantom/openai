import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseService, depositAuthEnvMissing, attachBuyerCookie } from "@/lib/deposits/server";
import { siteOrigin } from "@/lib/deposits/my-purchase";

/**
 * GET /auth/callback
 * Intercambia el código del magic link de Supabase Auth por sesión,
 * busca el buyer por email y emite la cookie op_buyer.
 */
export async function GET(request: Request) {
  const missing = depositAuthEnvMissing();
  const origin = siteOrigin(request as import("next/server").NextRequest);
  const fail = () => NextResponse.redirect(`${origin}/mi-compra?error=auth`);

  if (missing.length > 0) return fail();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/mi-compra";
  if (!code) return fail();

  const cookieStore = cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            /* Server Component context */
          }
        },
      },
    }
  );

  const { error } = await supabaseAuth.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchange", error);
    return fail();
  }

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  if (!email) return fail();

  const { data: buyer } = await supabaseService()
    .from("presale_buyers")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (!buyer) return fail();

  const redirect = NextResponse.redirect(`${origin}${next.startsWith("/") ? next : `/${next}`}`);
  return attachBuyerCookie(redirect, buyer.id);
}
