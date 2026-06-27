"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validation";

export type PasswordActionState = {
  error?: string;
  success?: string;
};

export async function changePassword(
  _prev: PasswordActionState,
  formData: FormData,
): Promise<PasswordActionState> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an." };
  }

  const parsed = changePasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("should be different")) {
      return { error: "Das neue Passwort muss sich vom alten unterscheiden." };
    }
    console.error("[passwort] changePassword:", error.message);
    return { error: "Passwort konnte nicht geändert werden." };
  }

  return { success: "Passwort erfolgreich geändert." };
}
