import type { SupabaseClient } from "@supabase/supabase-js";

const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

export type UsernameCheck =
  | { ok: true; available: boolean }
  | { ok: false };

/**
 * Prüft, ob ein Username frei ist. Versucht zuerst den RPC
 * `username_available`; fällt bei fehlender Funktion/Fehler auf eine
 * direkte Abfrage der öffentlich lesbaren profiles-Tabelle zurück.
 *
 * Mit `excludeUserId` (z. B. beim Profil-Update) wird das eigene Profil
 * ignoriert, damit eine Änderung (auch nur der Groß-/Kleinschreibung) nicht
 * am eigenen Eintrag scheitert.
 */
export async function checkUsernameAvailable(
  supabase: SupabaseClient,
  rawUsername: string,
  excludeUserId?: string,
): Promise<UsernameCheck> {
  const username = rawUsername.trim();

  if (!USERNAME_PATTERN.test(username)) {
    return { ok: true, available: false };
  }

  if (excludeUserId) {
    return checkViaQuery(supabase, username, excludeUserId);
  }

  const rpc = await supabase.rpc("username_available", { name: username });
  if (!rpc.error) {
    return { ok: true, available: Boolean(rpc.data) };
  }

  console.warn(
    "[username] RPC fehlgeschlagen, nutze Fallback:",
    rpc.error.message,
  );

  return checkViaQuery(supabase, username);
}

async function checkViaQuery(
  supabase: SupabaseClient,
  username: string,
  excludeUserId?: string,
): Promise<UsernameCheck> {
  let query = supabase.from("profiles").select("id").ilike("username", username);

  if (excludeUserId) {
    query = query.neq("id", excludeUserId);
  }

  const { data, error } = await query.limit(1);

  if (error) {
    console.error("[username] Abfrage fehlgeschlagen:", error.message);
    return { ok: false };
  }

  return { ok: true, available: (data?.length ?? 0) === 0 };
}
