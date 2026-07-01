import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const MAX_GEMINI_INSTRUCTIONS = 4000;

/**
 * Liest die global gespeicherten Gemini-Anweisungen über den
 * service_role-Client (umgeht RLS). Gibt bei Fehlern einen leeren String
 * zurück, damit die News-Erstellung nie blockiert.
 */
export async function getGeminiInstructions(): Promise<string> {
  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("app_settings")
      .select("gemini_instructions")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      console.warn("[settings] gemini_instructions:", error.message);
      return "";
    }

    return data?.gemini_instructions?.trim() ?? "";
  } catch (error) {
    console.warn(
      "[settings] nicht verfügbar:",
      error instanceof Error ? error.message : error,
    );
    return "";
  }
}

export async function saveGeminiInstructions(
  instructions: string,
  updatedBy: string,
): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("app_settings")
    .update({ gemini_instructions: instructions, updated_by: updatedBy })
    .eq("id", true);

  if (error) throw new Error(error.message);
}

export async function getSeedLikesEnabled(): Promise<boolean> {
  if (process.env.SEED_LIKES_ENABLED === "false") return false;

  try {
    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from("app_settings")
      .select("seed_likes_enabled")
      .eq("id", true)
      .maybeSingle();

    if (error) {
      console.warn("[settings] seed_likes_enabled:", error.message);
      return true;
    }

    return data?.seed_likes_enabled ?? true;
  } catch (error) {
    console.warn(
      "[settings] seed_likes_enabled nicht verfügbar:",
      error instanceof Error ? error.message : error,
    );
    return true;
  }
}

export async function setSeedLikesEnabled(enabled: boolean): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("app_settings")
    .update({ seed_likes_enabled: enabled })
    .eq("id", true);

  if (error) throw new Error(error.message);
}

export async function saveAdminSettings(
  instructions: string,
  seedLikesEnabled: boolean,
  updatedBy: string,
): Promise<void> {
  const admin = getSupabaseAdmin();
  const { error } = await admin
    .from("app_settings")
    .update({
      gemini_instructions: instructions,
      seed_likes_enabled: seedLikesEnabled,
      updated_by: updatedBy,
    })
    .eq("id", true);

  if (error) throw new Error(error.message);
}
