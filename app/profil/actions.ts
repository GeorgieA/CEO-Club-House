"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { updateProfileSchema } from "@/lib/validation";

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
    const { data: available, error: rpcError } = await supabase.rpc(
      "username_available",
      { name: username },
    );

    if (rpcError) {
      return { error: "Username-Prüfung fehlgeschlagen." };
    }

    if (!available) {
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
    return { error: "Profil konnte nicht gespeichert werden." };
  }

  revalidatePath("/profil");
  revalidatePath("/");

  return { success: "Profil gespeichert." };
}
