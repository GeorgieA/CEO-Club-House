"use server";

import { revalidatePath } from "next/cache";
import { setSubscription } from "@/lib/newsletter";
import { createClient, getUser } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validation";
import { checkUsernameAvailable } from "@/lib/username";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an." };
  }

  const categories = formData.getAll("preferredCategories") as string[];

  const parsed = updateProfileSchema.safeParse({
    username: formData.get("username"),
    businessUrl: formData.get("businessUrl") ?? "",
    preferredCategories: categories,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const { username, businessUrl, preferredCategories } = parsed.data;
  const supabase = await createClient();

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .maybeSingle();

  if (currentProfile?.username !== username) {
    const check = await checkUsernameAvailable(supabase, username, user.id);

    if (!check.ok) {
      return { error: "Username-Prüfung fehlgeschlagen." };
    }

    if (!check.available) {
      return { error: "Dieser Username ist bereits vergeben." };
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      business_url: businessUrl,
      preferred_categories: preferredCategories,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Dieser Username ist bereits vergeben." };
    }
    if (error.code === "23514") {
      return {
        error:
          "Username ungültig (3–20 Zeichen, Buchstaben, Zahlen, Unterstrich).",
      };
    }
    console.error("[profil] updateProfile:", error.code, error.message);
    return { error: "Profil konnte nicht gespeichert werden." };
  }

  if (user.email) {
    const wantsNewsletter = formData.get("newsletter") === "on";
    await setSubscription(user.email, wantsNewsletter);
  }

  revalidatePath("/profil");
  revalidatePath("/");

  return { success: "Profil gespeichert." };
}
