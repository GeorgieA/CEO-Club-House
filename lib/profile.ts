import { createClient, getUser } from "@/lib/supabase/server";
import type { NewsCategory } from "@/lib/data";
import type { Profile } from "@/lib/validation";

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (data as Profile) ?? null;
}

export function getPreferredCategories(
  profile: Profile | null,
): NewsCategory[] {
  if (!profile?.preferred_categories?.length) return [];
  return profile.preferred_categories.filter((c): c is NewsCategory =>
    ["tech", "ai", "business", "trend"].includes(c),
  );
}
