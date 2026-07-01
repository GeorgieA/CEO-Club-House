import { getSeedLikesEnabled, setSeedLikesEnabled } from "@/lib/settings";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const MAX_SEED_LIKES = 350;

/** Halbwertszeit in Stunden (~30 Tage). */
const HALF_LIFE_HOURS = 24 * 30;

const AUTO_DISABLE_VOTERS = 20;
const AUTO_DISABLE_DAYS = 7;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Mindest-Likes abhängig davon, wie lange der Artikel auf CEO Clubhouse ist.
 * Nutzt created_at (nicht RSS-published_at).
 */
function minSeedForSiteAge(ageHours: number, hash: number): number {
  if (ageHours < 1) return hash % 4;
  if (ageHours < 6) return 1 + (hash % 9);
  if (ageHours < 24) return 2 + (hash % 28);
  if (ageHours < 24 * 7) return 8 + (hash % 65);
  if (ageHours < 24 * 30) return 20 + (hash % 140);
  return 40 + (hash % 280);
}

/**
 * Deterministische Seed-Likes pro Artikel.
 * Basiert auf created_at (Seiten-Alter) + stabilem Hash → natürliche Streuung.
 */
export function computeSeedLikes(
  createdAt: string | Date,
  articleId: string,
): number {
  const created =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const ageHours = Math.max(
    0,
    (Date.now() - created.getTime()) / (1000 * 60 * 60),
  );

  const hash = hashString(articleId);
  const spreadHash = hashString(`${articleId}:spread`);

  const curve =
    MAX_SEED_LIKES * (1 - Math.exp(-ageHours / HALF_LIFE_HOURS));
  const multiplier = 0.45 + (hash % 1000) / 1000;
  const spread = (spreadHash % 37) - 18;

  const minLikes = minSeedForSiteAge(ageHours, hash);
  const value = Math.floor(curve * multiplier + spread);

  return Math.min(MAX_SEED_LIKES, Math.max(minLikes, value));
}

/** @deprecated Alias für ältere Aufrufer */
export function targetSeedLikes(
  createdAt: string | Date,
  articleId: string,
): number {
  return computeSeedLikes(createdAt, articleId);
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

/**
 * Schreibt berechnete Werte in die DB (Cache). Anzeige rechnet live aus created_at.
 */
export async function syncSeedLikes(): Promise<number> {
  if (!(await isSeedLikesEnabled())) return 0;

  const admin = getSupabaseAdmin();
  const pageSize = 500;
  let from = 0;
  let synced = 0;

  while (true) {
    const { data, error } = await admin
      .from("articles")
      .select("id, created_at, seed_likes")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      if (/seed_likes|created_at/i.test(error.message)) {
        console.error("[seed-likes] sync: Spalte fehlt?", error.message);
        return 0;
      }
      throw new Error(error.message);
    }
    if (!data?.length) break;

    for (const row of data) {
      const articleId = row.id as string;
      const createdAt = row.created_at as string;
      const current = (row.seed_likes as number) ?? 0;
      const target = computeSeedLikes(createdAt, articleId);

      if (current === target) continue;

      const { error: updateError } = await admin
        .from("articles")
        .update({ seed_likes: target })
        .eq("id", articleId);

      if (updateError) {
        console.error("[seed-likes] sync:", updateError.message);
        continue;
      }
      synced += 1;
    }

    if (data.length < pageSize) break;
    from += pageSize;
  }

  return synced;
}

/** Cron-Hook (Name bleibt für ingest-Route). */
export async function bumpSeedLikes(): Promise<number> {
  return syncSeedLikes();
}

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
