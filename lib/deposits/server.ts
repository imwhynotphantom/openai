import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Utilidades de servidor del sistema de depósitos.
 * La service key NUNCA sale del servidor (API routes / edge functions).
 */

export function supabaseService() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase no configurado (URL o SERVICE_ROLE_KEY)");
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Comprueba variables de entorno del sistema de depósitos (API routes). */
export function depositEnvMissing(): string[] {
  const missing: string[] = [];
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!process.env.DEPOSIT_TOKEN_SECRET && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    missing.push("DEPOSIT_TOKEN_SECRET");
  }
  return missing;
}

// ── Token opaco del comprador (id + HMAC) ──
// Evita exponer el uuid sin firmar: el cliente solo guarda este token.

function secret(): string {
  const s = process.env.DEPOSIT_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("Falta DEPOSIT_TOKEN_SECRET");
  return s;
}

export function signBuyerToken(buyerId: string): string {
  const mac = createHmac("sha256", secret()).update(buyerId).digest("base64url");
  return `${buyerId}.${mac}`;
}

/** Devuelve el buyerId si el token es válido; null en caso contrario. */
export function verifyBuyerToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const buyerId = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", secret()).update(buyerId).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return buyerId;
}

export const BUYER_COOKIE = "op_buyer";

export function attachBuyerCookie(res: NextResponse, buyerId: string): NextResponse {
  res.cookies.set(BUYER_COOKIE, signBuyerToken(buyerId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}

export function buyerIdFromRequest(req: { cookies: { get: (name: string) => { value?: string } | undefined } }): string | null {
  return verifyBuyerToken(req.cookies.get(BUYER_COOKIE)?.value);
}
