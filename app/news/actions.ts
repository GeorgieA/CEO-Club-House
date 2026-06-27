"use server";

import { revalidatePath } from "next/cache";
import { moderateComment } from "@/lib/moderation";
import { createClient, getUser } from "@/lib/supabase/server";
import { commentBodySchema } from "@/lib/validation";

export type ActionResult = {
  error?: string;
  success?: string;
};

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

export async function voteArticle(
  articleId: string,
  vote: 1 | -1,
  slug?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an, um zu voten." };
  }

  if (!articleId) {
    return { error: "Ungültiger Artikel." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("article_votes")
    .select("id, vote")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  if (existing) {
    if (existing.vote === vote) {
      const { error } = await supabase
        .from("article_votes")
        .delete()
        .eq("id", existing.id);

      if (error) return { error: "Vote konnte nicht entfernt werden." };
    } else {
      const { error } = await supabase
        .from("article_votes")
        .update({ vote })
        .eq("id", existing.id);

      if (error) return { error: "Vote konnte nicht geändert werden." };
    }
  } else {
    const { error } = await supabase.from("article_votes").insert({
      user_id: user.id,
      article_id: articleId,
      vote,
    });

    if (error) return { error: "Vote konnte nicht gespeichert werden." };
  }

  if (slug) revalidatePath(`/news/${slug}`);
  return { success: "ok" };
}

export async function addComment(
  articleId: string,
  body: string,
  slug?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an, um zu kommentieren." };
  }

  const parsed = commentBodySchema.safeParse(body);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültiger Kommentar." };
  }

  const supabase = await createClient();

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT) {
    return {
      error: "Zu viele Kommentare. Bitte warte eine Minute.",
    };
  }

  const moderation = await moderateComment(parsed.data);
  if (!moderation.allowed) {
    return { error: moderation.reason };
  }

  const { error } = await supabase.from("comments").insert({
    article_id: articleId,
    user_id: user.id,
    body: parsed.data,
    status: "published",
  });

  if (error) {
    return { error: "Kommentar konnte nicht gespeichert werden." };
  }

  if (slug) revalidatePath(`/news/${slug}`);
  return { success: "Kommentar veröffentlicht." };
}

export async function deleteComment(
  commentId: string,
  slug?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Kommentar konnte nicht gelöscht werden." };
  }

  if (slug) revalidatePath(`/news/${slug}`);
  return { success: "Kommentar gelöscht." };
}

export async function getVoteCounts(articleId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("article_votes")
    .select("vote")
    .eq("article_id", articleId);

  const likes = data?.filter((v) => v.vote === 1).length ?? 0;
  const dislikes = data?.filter((v) => v.vote === -1).length ?? 0;
  return { likes, dislikes };
}

export async function getUserVote(articleId: string): Promise<1 | -1 | null> {
  const user = await getUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("article_votes")
    .select("vote")
    .eq("user_id", user.id)
    .eq("article_id", articleId)
    .maybeSingle();

  return (data?.vote as 1 | -1) ?? null;
}

export async function getComments(articleId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      body,
      created_at,
      user_id,
      profiles(username, business_url)
    `,
    )
    .eq("article_id", articleId)
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[comments] getComments:", error.message);
    return [];
  }

  return (data ?? []).map((row) => {
    const profile = Array.isArray(row.profiles)
      ? row.profiles[0]
      : row.profiles;
    return {
      id: row.id as string,
      body: row.body as string,
      created_at: row.created_at as string,
      user_id: row.user_id as string,
      profiles: {
        username: (profile?.username as string) ?? "unbekannt",
        business_url: (profile?.business_url as string | null) ?? null,
      },
    };
  });
}
