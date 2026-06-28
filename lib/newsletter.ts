import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Newsletter-/Subscriber-Verwaltung. Läuft bewusst über den service_role-Client,
 * da die subscribers-Tabelle nur eine anon-INSERT-Policy hat (kein SELECT/DELETE
 * via RLS). Alle Aufrufe erfolgen serverseitig nach Auth-Prüfung.
 */

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function isSubscribed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("subscribers")
      .select("id")
      .eq("email", normalized)
      .maybeSingle();

    if (error) {
      console.warn("[newsletter] isSubscribed:", error.message);
      return false;
    }
    return Boolean(data);
  } catch (error) {
    console.warn(
      "[newsletter] isSubscribed nicht verfügbar:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}

/** Trägt eine E-Mail in die subscribers-Tabelle ein. Duplikate werden ignoriert. */
export async function subscribe(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from("subscribers")
      .insert({ email: normalized });

    // 23505 = unique_violation → bereits angemeldet, gilt als Erfolg.
    if (error && error.code !== "23505") {
      console.error("[newsletter] subscribe:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[newsletter] subscribe:", error);
    return false;
  }
}

/** Entfernt eine E-Mail aus der subscribers-Tabelle. */
export async function unsubscribe(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin
      .from("subscribers")
      .delete()
      .eq("email", normalized);

    if (error) {
      console.error("[newsletter] unsubscribe:", error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[newsletter] unsubscribe:", error);
    return false;
  }
}

/** Setzt den Abo-Status entsprechend `wanted` (idempotent). */
export async function setSubscription(
  email: string,
  wanted: boolean,
): Promise<void> {
  if (wanted) {
    await subscribe(email);
  } else {
    await unsubscribe(email);
  }
}
