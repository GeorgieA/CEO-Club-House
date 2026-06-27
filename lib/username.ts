import type { SupabaseClient } from "@supabase/supabase-js";

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

export type UsernameCheck =
  | { ok: true; available: boolean }
  | { ok: false };

/**
 * Prüft, ob ein Username frei ist. Versucht zuerst den RPC
 * `username_available`; fällt bei fehlender Funktion/Fehler auf eine
 * direkte Abfrage der öffentlich lesbaren profiles-Tabelle zurück.
 */
export async function checkUsernameAvailable(
  supabase: SupabaseClient,
  rawUsername: string,
): Promise<UsernameCheck> {
  const username = rawUsername.trim();

  if (!USERNAME_PATTERN.test(username)) {
    return { ok: true, available: false };
  }

  const rpc = await supabase.rpc("username_available", { name: username });
  if (!rpc.error) {
    return { ok: true, available: Boolean(rpc.data) };
  }

  console.warn(
    "[username] RPC fehlgeschlagen, nutze Fallback:",
    rpc.error.message,
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .ilike("username", username)
    .maybeSingle();

  if (error) {
    console.error("[username] Fallback-Abfrage fehlgeschlagen:", error.message);
    return { ok: false };
  }

  return { ok: true, available: data === null };
}
