"use server";

import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { changePasswordSchema } from "@/lib/validation";

export type ResetPasswordActionState = {
  error?: string;
  success?: string;
};

export async function resetPassword(
  _prev: ResetPasswordActionState,
  formData: FormData,
): Promise<ResetPasswordActionState> {
  const user = await getUser();
  if (!user) {
    return {
      error:
        "Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.",
    };
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
    console.error("[passwort-zuruecksetzen] resetPassword:", error.message);
    return { error: "Passwort konnte nicht geändert werden." };
  }

  redirect("/login?reset=1");
}
