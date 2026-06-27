import { createBrowserClient } from "@supabase/ssr";

function getAnonKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = getAnonKey();

  if (!url || !key) {
    throw new Error("Supabase Env-Variablen fehlen.");
  }

  return createBrowserClient(url, key);
}
