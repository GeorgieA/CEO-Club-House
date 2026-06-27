import { getUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/**
 * Prüft serverseitig, ob der aktuell angemeldete Nutzer Admin ist.
 * Liest das is_admin-Flag über den service_role-Client.
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    return Boolean(data?.is_admin);
  } catch (error) {
    console.warn(
      "[admin] Admin-Prüfung fehlgeschlagen:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
