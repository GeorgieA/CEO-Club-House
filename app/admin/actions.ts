"use server";

import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "@/lib/admin";
import { getUser } from "@/lib/supabase/server";
import {
  MAX_GEMINI_INSTRUCTIONS,
  saveAdminSettings,
} from "@/lib/settings";

export type AdminActionState = {
  error?: string;
  success?: string;
};

export async function updateGeminiInstructions(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const user = await getUser();
  if (!user || !(await isCurrentUserAdmin())) {
    return { error: "Kein Zugriff." };
  }

  const raw = (formData.get("geminiInstructions") as string | null) ?? "";
  const instructions = raw.trim();
  const seedLikesEnabled = formData.get("seedLikesEnabled") === "on";

  if (instructions.length > MAX_GEMINI_INSTRUCTIONS) {
    return {
      error: `Maximal ${MAX_GEMINI_INSTRUCTIONS} Zeichen erlaubt.`,
    };
  }

  try {
    await saveAdminSettings(instructions, seedLikesEnabled, user.id);
  } catch (error) {
    console.error("[admin] saveAdminSettings:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/admin");

  return {
    success:
      "Einstellungen gespeichert. Seed-Likes und Gemini-Anweisungen gelten ab dem nächsten Import.",
  };
}
