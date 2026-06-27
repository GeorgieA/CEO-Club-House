"use server";

import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "@/lib/admin";
import { getUser } from "@/lib/supabase/server";
import {
  MAX_GEMINI_INSTRUCTIONS,
  saveGeminiInstructions,
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

  if (instructions.length > MAX_GEMINI_INSTRUCTIONS) {
    return {
      error: `Maximal ${MAX_GEMINI_INSTRUCTIONS} Zeichen erlaubt.`,
    };
  }

  try {
    await saveGeminiInstructions(instructions, user.id);
  } catch (error) {
    console.error("[admin] saveGeminiInstructions:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/admin");

  return { success: "Anweisungen gespeichert. Sie gelten ab dem nächsten Import." };
}
