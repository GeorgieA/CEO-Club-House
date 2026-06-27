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

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...data }));
}

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
  log("ingest.start", {});

  try {
    const { articles: raw, feedResults } = await fetchAllFeeds();

    for (const result of feedResults) {
      log("feed.result", {
        source: result.name,
        status: result.status,
        count: result.count,
        ...(result.error ? { error: result.error } : {}),
      });
    }

    const feedsFailed = feedResults
      .filter((result) => result.status === "error")
      .map((result) => result.name);

    if (feedResults.every((result) => result.status === "error")) {
      log("ingest.failed", { reason: "all_feeds_down", feedsFailed });
      return NextResponse.json(
        {
          ok: false,
          error: "Alle RSS-Feeds sind nicht erreichbar.",
          feedsFailed,
          durationMs: Date.now() - startedAt,
        },
        { status: 503 },
      );
    }

    const unique = dedupeBySimilarity(raw).filter((a) => a.link);

    log("dedupe", {
      raw: raw.length,
      unique: unique.length,
      duplicatesRemoved: raw.length - unique.length,
    });

    const existingUrls = await getExistingSourceUrls();
    const fresh = unique.filter((a) => !existingUrls.has(a.link));

    log("db.check", {
      existing: existingUrls.size,
      fresh: fresh.length,
      skipped: unique.length - fresh.length,
    });

    if (fresh.length === 0) {
      log("ingest.done", {
        inserted: 0,
        skipped: unique.length,
        feedsFailed,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({
        ok: true,
        inserted: 0,
        skipped: unique.length,
        message: "Keine neuen Artikel.",
        feedsFailed,
        durationMs: Date.now() - startedAt,
      });
    }

    const prepared = fresh.map((article) => {
      const id = article.link;
      const category = categorize(article.title, article.description);
      return { article, id, category };
    });

    const summarizeStartedAt = Date.now();
    const summaries = await summarizeArticles(
      prepared.map(({ id, article }) => ({
        id,
        title: article.title,
        description: article.description,
      })),
    );

    log("summarize", {
      count: prepared.length,
      durationMs: Date.now() - summarizeStartedAt,
    });

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

    log("ingest.done", {
      inserted,
      skipped: unique.length - fresh.length,
      candidates: fresh.length,
      feedsFailed,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      ok: true,
      inserted,
      skipped: unique.length - fresh.length,
      candidates: fresh.length,
      feedsFailed,
      durationMs: Date.now() - startedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ingest fehlgeschlagen";
    log("ingest.error", { error: message });
    console.error("[cron/ingest]", error);
    return NextResponse.json(
      {
        ok: false,
        error: message,
        durationMs: Date.now() - startedAt,
      },
      { status: 500 },
    );
  }
}
