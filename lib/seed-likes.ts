import { getSeedLikesEnabled, setSeedLikesEnabled } from "@/lib/settings";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const MAX_SEED_LIKES = 350;

/** Halbwertszeit in Stunden (~30 Tage bis ~221 Likes). */
const HALF_LIFE_HOURS = 24 * 30;

const AUTO_DISABLE_VOTERS = 20;
const AUTO_DISABLE_DAYS = 7;

export function targetSeedLikes(publishedAt: string | Date): number {
  const published =
    typeof publishedAt === "string" ? new Date(publishedAt) : publishedAt;
  const ageHours = Math.max(
    0,
    (Date.now() - published.getTime()) / (1000 * 60 * 60),
  );
  const raw = MAX_SEED_LIKES * (1 - Math.exp(-ageHours / HALF_LIFE_HOURS));
  return Math.min(MAX_SEED_LIKES, Math.floor(raw));
}

export function displayLikeCount(
  realLikes: number,
  seedLikes: number,
  enabled: boolean,
): number {
  return realLikes + (enabled ? seedLikes : 0);
}

export async function isSeedLikesEnabled(): Promise<boolean> {
  return getSeedLikesEnabled();
}

function bumpAmount(
  current: number,
  target: number,
  ageHours: number,
): number {
  if (current >= target) return 0;
  const headroom = target - current;
  const maxBump = ageHours < 6 ? 1 : Math.floor(Math.random() * 4);
  return Math.min(headroom, maxBump);
}

/**
 * Erhöht seed_likes für alle Artikel Richtung Zielkurve.
 * Läuft stündlich über den Ingest-Cron (service_role).
 */
export async function bumpSeedLikes(): Promise<number> {
  if (!(await isSeedLikesEnabled())) return 0;

  const admin = getSupabaseAdmin();
  const pageSize = 500;
  let from = 0;
  let bumped = 0;

  while (true) {
    const { data, error } = await admin
      .from("articles")
      .select("id, published_at, seed_likes")
      .order("published_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;

    const updates: { id: string; seed_likes: number }[] = [];

    for (const row of data) {
      const current = (row.seed_likes as number) ?? 0;
      const publishedAt = row.published_at as string;
      const target = targetSeedLikes(publishedAt);
      const ageHours = Math.max(
        0,
        (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60),
      );
      const increment = bumpAmount(current, target, ageHours);
      if (increment <= 0) continue;

      updates.push({
        id: row.id as string,
        seed_likes: Math.min(MAX_SEED_LIKES, current + increment),
      });
    }

    for (const update of updates) {
      const { error: updateError } = await admin
        .from("articles")
        .update({ seed_likes: update.seed_likes })
        .eq("id", update.id);

      if (updateError) {
        console.error("[seed-likes] bump:", updateError.message);
        continue;
      }
      bumped += 1;
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return bumped;
}

/**
 * Schaltet Seed-Likes ab, sobald genug echte Nutzer voten.
 */
export async function maybeAutoDisableSeedLikes(): Promise<boolean> {
  if (!(await isSeedLikesEnabled())) return false;

  const admin = getSupabaseAdmin();
  const since = new Date(
    Date.now() - AUTO_DISABLE_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data, error } = await admin
    .from("article_votes")
    .select("user_id")
    .gte("created_at", since);

  if (error) {
    console.error("[seed-likes] auto-disable check:", error.message);
    return false;
  }

  const distinctVoters = new Set(
    (data ?? []).map((row) => row.user_id as string),
  ).size;

  if (distinctVoters < AUTO_DISABLE_VOTERS) return false;

  await setSeedLikesEnabled(false);
  console.log(
    JSON.stringify({
      event: "seed_likes.auto_disabled",
      distinctVoters,
      windowDays: AUTO_DISABLE_DAYS,
    }),
  );
  return true;
}
