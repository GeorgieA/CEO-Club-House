import { getSeedLikesEnabled, setSeedLikesEnabled } from "@/lib/settings";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const MAX_SEED_LIKES = 350;

const AUTO_DISABLE_VOTERS = 20;
const AUTO_DISABLE_DAYS = 7;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function hashUnit(input: string): number {
  return (hashString(input) % 1000) / 1000;
}

/** Min/Max-Bänder nach Seiten-Alter (created_at). */
const AGE_BANDS: { ageMinutes: number; min: number; max: number }[] = [
  { ageMinutes: 0, min: 8, max: 35 },
  { ageMinutes: 10, min: 10, max: 70 },
  { ageMinutes: 60, min: 10, max: 250 },
  { ageMinutes: 360, min: 30, max: 300 },
  { ageMinutes: 1440, min: 50, max: 350 },
  { ageMinutes: 10080, min: 90, max: 350 },
  { ageMinutes: 43200, min: 140, max: 350 },
];

function bandForAgeMinutes(ageMinutes: number): { min: number; max: number } {
  if (ageMinutes <= AGE_BANDS[0].ageMinutes) return AGE_BANDS[0];

  for (let i = 1; i < AGE_BANDS.length; i++) {
    const prev = AGE_BANDS[i - 1];
    const next = AGE_BANDS[i];
    if (ageMinutes <= next.ageMinutes) {
      const t =
        (ageMinutes - prev.ageMinutes) / (next.ageMinutes - prev.ageMinutes);
      return {
        min: Math.round(prev.min + t * (next.min - prev.min)),
        max: Math.round(prev.max + t * (next.max - prev.max)),
      };
    }
  }

  return AGE_BANDS[AGE_BANDS.length - 1];
}

/**
 * Deterministische Seed-Likes pro Artikel.
 * Basiert auf created_at (Seiten-Alter) + stabilem Hash → Streuung im Altersband.
 */
export function computeSeedLikes(
  createdAt: string | Date,
  articleId: string,
): number {
  const created =
    typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const ageMinutes = Math.max(
    0,
    (Date.now() - created.getTime()) / (1000 * 60),
  );

  const { min, max } = bandForAgeMinutes(ageMinutes);
  const spread = hashUnit(articleId);
  const jitter = hashUnit(`${articleId}:jitter`);

  // Zwei Hashes mischen, damit nicht alle am Band-Rand landen.
  const t = spread * 0.72 + jitter * 0.28;
  const value = Math.floor(min + t * (max - min));

  return Math.min(MAX_SEED_LIKES, Math.max(min, value));
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
