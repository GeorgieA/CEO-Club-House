import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function getAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

/** Browser-sicherer Supabase-Client (anon/publishable key). */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getAnonKey();

  if (!url || !key) {
    if (typeof window !== "undefined") {
      console.warn("[supabase] Env-Variablen fehlen – Client nicht verfügbar.");
    }
    return null;
  }

  client = createClient(url, key);
  return client;
}

/** Server-side read client (anon key). */
export function createSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getAnonKey();
  if (!url || !key) return null;
  return createClient(url, key);
}
