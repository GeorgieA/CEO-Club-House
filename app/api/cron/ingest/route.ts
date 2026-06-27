import { NextResponse } from "next/server";
import {
  getExistingSourceUrls,
  insertArticles,
  slugify,
  type ArticleInsert,
} from "@/lib/articles";
import { categorize } from "@/lib/categorize";
import { dedupeBySimilarity } from "@/lib/dedupe";
import { fetchAllFeeds } from "@/lib/feeds";
import { summarizeArticles } from "@/lib/summarize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const raw = await fetchAllFeeds();
    const unique = dedupeBySimilarity(raw).filter((a) => a.link);

    const existingUrls = await getExistingSourceUrls();
    const fresh = unique.filter((a) => !existingUrls.has(a.link));

    if (fresh.length === 0) {
      return NextResponse.json({
        ok: true,
        inserted: 0,
        skipped: unique.length,
        message: "Keine neuen Artikel.",
        durationMs: Date.now() - startedAt,
      });
    }

    const prepared = fresh.map((article) => {
      const id = article.link;
      const category = categorize(article.title, article.description);
      return { article, id, category };
    });

    const summaries = await summarizeArticles(
      prepared.map(({ id, article }) => ({
        id,
        title: article.title,
        description: article.description,
      })),
    );

    const rows: ArticleInsert[] = prepared.map(({ article, id, category }) => ({
      title: article.title,
      slug: slugify(article.title, article.link),
      summary: summaries.get(id) ?? article.description,
      category,
      source: article.source,
      source_url: article.link,
      published_at: article.publishedAt,
    }));

    const inserted = await insertArticles(rows);

    return NextResponse.json({
      ok: true,
      inserted,
      skipped: unique.length - fresh.length,
      candidates: fresh.length,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error("[cron/ingest]", error);
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Ingest fehlgeschlagen",
      },
      { status: 500 },
    );
  }
}
