"use server";

import { revalidatePath } from "next/cache";
import { isCurrentUserAdmin } from "@/lib/admin";
import { moderateComment } from "@/lib/moderation";
import { createClient, getUser } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { commentBodySchema, reportReasonSchema } from "@/lib/validation";

export type ActionResult = {
  error?: string;
  success?: string;
};

/** Clientseitige Admin-Prüfung, damit die Artikelseite statisch bleiben kann. */
export async function checkIsAdmin(): Promise<boolean> {
  return isCurrentUserAdmin();
}

/**
 * Löscht einen kompletten Artikel. Nur für Admins. Läuft über den
 * service_role-Client; zugehörige Likes und Kommentare entfernt die
 * Datenbank per ON DELETE CASCADE automatisch mit.
 */
export async function deleteArticle(
  articleId: string,
  slug?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user || !(await isCurrentUserAdmin())) {
    return { error: "Kein Zugriff." };
  }

  if (!articleId) {
    return { error: "Ungültiger Artikel." };
  }

  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("articles").delete().eq("id", articleId);

    if (error) {
      console.error("[admin] deleteArticle:", error.message);
      return { error: "Artikel konnte nicht gelöscht werden." };
    }
  } catch (error) {
    console.error("[admin] deleteArticle:", error);
    return { error: "Artikel konnte nicht gelöscht werden." };
  }

  revalidatePath("/");
  if (slug) revalidatePath(`/news/${slug}`);
  return { success: "Artikel gelöscht." };
}

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

  return { success: "ok" };
}

export async function addComment(
  articleId: string,
  body: string,
  slug?: string,
  parentId?: string | null,
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

  // Replies: nur 1 Ebene. Reply-auf-Reply wird an die Wurzel gehängt (flatten).
  let effectiveParent: string | null = parentId ?? null;
  if (effectiveParent) {
    const { data: parent } = await supabase
      .from("comments")
      .select("id, parent_id, article_id")
      .eq("id", effectiveParent)
      .maybeSingle();

    if (!parent || parent.article_id !== articleId) {
      return { error: "Ungültiger Kommentar." };
    }
    effectiveParent = (parent.parent_id as string | null) ?? (parent.id as string);
  }

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

  let { error } = await supabase.from("comments").insert({
    article_id: articleId,
    user_id: user.id,
    body: parsed.data,
    status: "published",
    parent_id: effectiveParent,
  });

  // Fallback, falls die parent_id-Spalte (comments-threads.sql) noch nicht
  // migriert wurde: ohne parent_id erneut versuchen, statt zu scheitern.
  if (error && /parent_id/i.test(error.message)) {
    console.warn(
      "[comments] parent_id-Spalte fehlt – Insert ohne Threads. Bitte comments-threads.sql ausführen.",
    );
    ({ error } = await supabase.from("comments").insert({
      article_id: articleId,
      user_id: user.id,
      body: parsed.data,
      status: "published",
    }));
  }

  if (error) {
    console.error("[comments] addComment:", error.code, error.message);
    return { error: "Kommentar konnte nicht gespeichert werden." };
  }

  if (slug) revalidatePath(`/news/${slug}`);
  return {
    success: effectiveParent
      ? "Antwort veröffentlicht."
      : "Kommentar veröffentlicht.",
  };
}

export async function voteComment(
  commentId: string,
  slug?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an, um zu liken." };
  }
  if (!commentId) {
    return { error: "Ungültiger Kommentar." };
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("comment_votes")
    .select("id")
    .eq("user_id", user.id)
    .eq("comment_id", commentId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("comment_votes")
      .delete()
      .eq("id", existing.id);
    if (error) return { error: "Like konnte nicht entfernt werden." };
  } else {
    const { error } = await supabase.from("comment_votes").insert({
      user_id: user.id,
      comment_id: commentId,
    });
    if (error) return { error: "Like konnte nicht gespeichert werden." };
  }

  return { success: "ok" };
}

export async function reportComment(
  commentId: string,
  reason?: string,
): Promise<ActionResult> {
  const user = await getUser();
  if (!user) {
    return { error: "Bitte melde dich an, um zu melden." };
  }
  if (!commentId) {
    return { error: "Ungültiger Kommentar." };
  }

  const parsedReason = reportReasonSchema.safeParse(reason ?? "");
  if (!parsedReason.success) {
    return {
      error: parsedReason.error.issues[0]?.message ?? "Ungültiger Grund.",
    };
  }

  const supabase = await createClient();

  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("comment_reports")
    .select("*", { count: "exact", head: true })
    .eq("reporter_id", user.id)
    .gte("created_at", since);

  if ((count ?? 0) >= 10) {
    return { error: "Zu viele Meldungen. Bitte warte eine Minute." };
  }

  const { error } = await supabase.from("comment_reports").insert({
    comment_id: commentId,
    reporter_id: user.id,
    reason: parsedReason.data || null,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Du hast diesen Kommentar bereits gemeldet." };
    }
    return { error: "Meldung konnte nicht gespeichert werden." };
  }

  return { success: "Danke, der Kommentar wurde gemeldet." };
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

/**
 * Lädt die Votes des aktuellen Nutzers für mehrere Artikel auf einmal.
 * Für die Startseiten-Liste, damit nicht pro Karte ein eigener Request läuft.
 * Gibt zusätzlich zurück, ob ein Nutzer eingeloggt ist.
 */
export async function getUserVotes(
  articleIds: string[],
): Promise<{ loggedIn: boolean; votes: Record<string, 1 | -1> }> {
  const user = await getUser();
  if (!user) return { loggedIn: false, votes: {} };
  if (articleIds.length === 0) return { loggedIn: true, votes: {} };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("article_votes")
    .select("article_id, vote")
    .eq("user_id", user.id)
    .in("article_id", articleIds);

  if (error) {
    console.error("[votes] getUserVotes:", error.message);
    return { loggedIn: true, votes: {} };
  }

  const votes: Record<string, 1 | -1> = {};
  for (const row of data ?? []) {
    votes[row.article_id as string] = row.vote as 1 | -1;
  }
  return { loggedIn: true, votes };
}

export async function getCommentCount(articleId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("article_id", articleId)
    .eq("status", "published");

  return count ?? 0;
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
      parent_id,
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
      parent_id: (row.parent_id as string | null) ?? null,
      profiles: {
        username: (profile?.username as string) ?? "unbekannt",
        business_url: (profile?.business_url as string | null) ?? null,
      },
    };
  });
}

export async function getCommentVoteCounts(
  commentIds: string[],
): Promise<Record<string, number>> {
  if (commentIds.length === 0) return {};

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment_votes")
    .select("comment_id")
    .in("comment_id", commentIds);

  if (error) {
    console.error("[comments] getCommentVoteCounts:", error.message);
    return {};
  }

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const id = row.comment_id as string;
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

export async function getUserCommentVotes(
  commentIds: string[],
): Promise<string[]> {
  if (commentIds.length === 0) return [];

  const user = await getUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("comment_votes")
    .select("comment_id")
    .eq("user_id", user.id)
    .in("comment_id", commentIds);

  if (error) {
    console.error("[comments] getUserCommentVotes:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.comment_id as string);
}
