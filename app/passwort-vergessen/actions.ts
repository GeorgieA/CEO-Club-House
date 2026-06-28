"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site";
import { emailSchema } from "@/lib/validation";

export type ForgotPasswordActionState = {
  error?: string;
  success?: string;
};

export async function requestPasswordReset(
  _prev: ForgotPasswordActionState,
  formData: FormData,
): Promise<ForgotPasswordActionState> {
  const parsed = emailSchema.safeParse(formData.get("email"));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const supabase = await createClient();
  const siteUrl = getSiteUrl();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${siteUrl}/auth/confirm?type=recovery&next=/passwort-zuruecksetzen`,
  });

  if (error) {
    console.error("[passwort-vergessen] resetPasswordForEmail:", error.message);
  }

  // Immer neutrale Bestätigung — kein Hinweis, ob die E-Mail existiert.
  return {
    success:
      "Falls ein Konto mit dieser E-Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt. Prüfe auch deinen Spam-Ordner.",
  };
}
