import {
  categoryLabels,
  type NewsCategory,
  type NewsItem,
} from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { relativeTime } from "@/lib/time";

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  category: NewsCategory;
  source: string;
  source_url: string;
  published_at: string;
  created_at: string;
}

export interface ArticleInsert {
  title: string;
  slug: string;
  summary: string;
  category: NewsCategory;
  source: string;
  source_url: string;
  published_at: string;
}

function shortHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function slugify(title: string, sourceUrl: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  const suffix = shortHash(sourceUrl).slice(0, 6);
  return base ? `${base}-${suffix}` : `artikel-${suffix}`;
}

export function rowToNewsItem(row: ArticleRow): NewsItem {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    categoryLabel: categoryLabels[row.category],
    time: relativeTime(row.published_at),
    source: row.source,
    headline: row.title,
    summary: row.summary,
    link: row.source_url,
    publishedAt: row.published_at,
  };
}

export async function getTodayArticleCount(): Promise<number> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return 0;

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/Berlin",
  });

  const { count, error } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", `${today}T00:00:00`);

  if (error) {
    console.error("[articles] getTodayArticleCount:", error.message);
    return 0;
  }

  return count ?? 0;
}

export interface TrendingArticle {
  id: string;
  slug: string;
  title: string;
}

export async function getTrendingArticles(
  limit = 5,
): Promise<TrendingArticle[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("id, slug, title")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[articles] getTrendingArticles:", error.message);
    return [];
  }

  return data as TrendingArticle[];
}

export async function getAllArticlesForSitemap(): Promise<
  { slug: string; published_at: string }[]
> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("slug, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[articles] getAllArticlesForSitemap:", error.message);
    return [];
  }

  return data as { slug: string; published_at: string }[];
}

export async function getAllArticles(limit = 200): Promise<NewsItem[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[articles] getAllArticles:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(rowToNewsItem);
}

export async function getArticlesByCategory(
  category: NewsCategory,
  limit = 200,
): Promise<NewsItem[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("category", category)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[articles] getArticlesByCategory:", error.message);
    return [];
  }

  return (data as ArticleRow[]).map(rowToNewsItem);
}

export async function getArticleBySlug(slug: string): Promise<ArticleRow | null> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[articles] getArticleBySlug:", error.message);
    return null;
  }

  return data as ArticleRow | null;
}

export async function getAllSlugs(): Promise<string[]> {
  const supabase = createSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase.from("articles").select("slug");

  if (error) {
    console.error("[articles] getAllSlugs:", error.message);
    return [];
  }

  return (data ?? []).map((row: { slug: string }) => row.slug);
}

export async function getExistingSourceUrls(): Promise<Set<string>> {
  const admin = getSupabaseAdmin();
  const urls = new Set<string>();
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await admin
      .from("articles")
      .select("source_url")
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    if (!data?.length) break;

    for (const row of data) {
      if (row.source_url) urls.add(row.source_url);
    }
    if (data.length < pageSize) break;
    from += pageSize;
  }

  return urls;
}

export async function insertArticles(rows: ArticleInsert[]): Promise<number> {
  if (rows.length === 0) return 0;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("articles")
    .upsert(rows, { onConflict: "source_url", ignoreDuplicates: true })
    .select("id");

  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}
