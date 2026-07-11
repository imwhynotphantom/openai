import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Cliente anon para magic links (Supabase Auth). Solo en rutas de servidor. */
export function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase Auth no configurado (URL o ANON_KEY)");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
