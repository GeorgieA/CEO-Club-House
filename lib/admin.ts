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

export interface UserStats {
  total: number;
  last7Days: number;
  last30Days: number;
  admins: number;
}

/**
 * Liefert Kennzahlen zu registrierten Nutzern (über den service_role-Client).
 * Zählt Zeilen in public.profiles – jede Registrierung legt genau ein Profil an.
 */
export async function getUserStats(): Promise<UserStats> {
  const empty: UserStats = { total: 0, last7Days: 0, last30Days: 0, admins: 0 };

  try {
    const admin = getSupabaseAdmin();
    const now = Date.now();
    const since7 = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
    const since30 = new Date(now - 30 * 24 * 60 * 60 * 1000).toISOString();

    const countQuery = () =>
      admin.from("profiles").select("*", { count: "exact", head: true });

    const [totalRes, last7Res, last30Res, adminRes] = await Promise.all([
      countQuery(),
      countQuery().gte("created_at", since7),
      countQuery().gte("created_at", since30),
      countQuery().eq("is_admin", true),
    ]);

    return {
      total: totalRes.count ?? 0,
      last7Days: last7Res.count ?? 0,
      last30Days: last30Res.count ?? 0,
      admins: adminRes.count ?? 0,
    };
  } catch (error) {
    console.warn(
      "[admin] getUserStats fehlgeschlagen:",
      error instanceof Error ? error.message : error,
    );
    return empty;
  }
}
