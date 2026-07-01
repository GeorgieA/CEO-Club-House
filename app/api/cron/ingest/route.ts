import { NextResponse } from "next/server";
import {
  getExistingSourceUrls,
  insertArticles,
  slugify,
  type ArticleInsert,
} from "@/lib/articles";
import { classifyArticle } from "@/lib/categorize";
import { dedupeBySimilarity } from "@/lib/dedupe";
import { fetchAllFeeds } from "@/lib/feeds";
import { getGeminiInstructions } from "@/lib/settings";
import { bumpSeedLikes, maybeAutoDisableSeedLikes } from "@/lib/seed-likes";
import { isHelpfulArticle, summarizeArticles } from "@/lib/summarize";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Obergrenze neuer Artikel pro Lauf. Schützt den Gemini-Summarizer (5er-Chunks
// parallel) vor Rate-Limits, wenn nach Filter-Anpassungen viele Treffer kommen.
const MAX_NEW_PER_RUN = 60;

function log(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...data }));
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

async function runSeedLikeMaintenance() {
  const seedLikesBumped = await bumpSeedLikes();
  const seedLikesDisabled = await maybeAutoDisableSeedLikes();
  return { seedLikesBumped, seedLikesDisabled };
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
        category: result.category,
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

    const classified = unique
      .map((article) => ({
        article,
        category: classifyArticle(
          article.title,
          article.description,
          article.feedCategory,
        ),
      }))
      .filter(
        (entry): entry is typeof entry & { category: NonNullable<typeof entry.category> } =>
          entry.category !== null,
      );

    const rejectedByCategory = unique.length - classified.length;

    log("filter.category", {
      raw: unique.length,
      kept: classified.length,
      rejected: rejectedByCategory,
    });

    const existingUrls = await getExistingSourceUrls();
    const freshAll = classified.filter(
      ({ article }) => !existingUrls.has(article.link),
    );

    // Neueste zuerst und auf MAX_NEW_PER_RUN begrenzen.
    const fresh = [...freshAll]
      .sort(
        (a, b) =>
          new Date(b.article.publishedAt).getTime() -
          new Date(a.article.publishedAt).getTime(),
      )
      .slice(0, MAX_NEW_PER_RUN);

    log("db.check", {
      existing: existingUrls.size,
      freshTotal: freshAll.length,
      fresh: fresh.length,
      cappedBy: freshAll.length - fresh.length,
      skipped: classified.length - freshAll.length,
    });

    if (fresh.length === 0) {
      const { seedLikesBumped, seedLikesDisabled } = await runSeedLikeMaintenance();

      log("ingest.done", {
        inserted: 0,
        skipped: classified.length,
        rejectedByCategory,
        feedsFailed,
        seedLikesBumped,
        seedLikesDisabled,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({
        ok: true,
        inserted: 0,
        skipped: classified.length,
        rejectedByCategory,
        message: "Keine neuen Artikel.",
        feedsFailed,
        seedLikesBumped,
        seedLikesDisabled,
        durationMs: Date.now() - startedAt,
      });
    }

    const prepared = fresh.map(({ article, category }) => ({
      article,
      id: article.link,
      category,
    }));

    const geminiInstructions = await getGeminiInstructions();

    const summarizeStartedAt = Date.now();
    const summaries = await summarizeArticles(
      prepared.map(({ id, article }) => ({
        id,
        title: article.title,
        description: article.description,
      })),
      geminiInstructions,
    );

    log("summarize", {
      count: prepared.length,
      hasCustomInstructions: geminiInstructions.length > 0,
      durationMs: Date.now() - summarizeStartedAt,
    });

    // Qualitätsfilter: nur Artikel mit einer echten, hilfreichen
    // Zusammenfassung behalten. Kryptische Headlines ohne Mehrwert fliegen raus.
    const helpful = prepared
      .map(({ article, id, category }) => ({
        article,
        id,
        category,
        result: summaries.get(id) ?? { summary: article.description, ai: false },
      }))
      .filter(({ result, article }) =>
        isHelpfulArticle(result, article.title, article.description),
      );

    const rejectedUnhelpful = prepared.length - helpful.length;

    log("filter.helpful", {
      candidates: prepared.length,
      kept: helpful.length,
      rejected: rejectedUnhelpful,
    });

    if (helpful.length === 0) {
      const { seedLikesBumped, seedLikesDisabled } = await runSeedLikeMaintenance();

      log("ingest.done", {
        inserted: 0,
        skipped: classified.length - fresh.length,
        candidates: fresh.length,
        rejectedByCategory,
        rejectedUnhelpful,
        feedsFailed,
        seedLikesBumped,
        seedLikesDisabled,
        durationMs: Date.now() - startedAt,
      });

      return NextResponse.json({
        ok: true,
        inserted: 0,
        skipped: classified.length - fresh.length,
        candidates: fresh.length,
        rejectedByCategory,
        rejectedUnhelpful,
        message: "Keine Artikel mit hilfreicher Zusammenfassung.",
        feedsFailed,
        seedLikesBumped,
        seedLikesDisabled,
        durationMs: Date.now() - startedAt,
      });
    }

    const rows: ArticleInsert[] = helpful.map(
      ({ article, result, category }) => ({
        title: article.title,
        slug: slugify(article.title, article.link),
        summary: result.summary,
        category,
        source: article.source,
        source_url: article.link,
        published_at: article.publishedAt,
      }),
    );

    const inserted = await insertArticles(rows);

    const { seedLikesBumped, seedLikesDisabled } = await runSeedLikeMaintenance();

    log("ingest.done", {
      inserted,
      skipped: classified.length - fresh.length,
      candidates: fresh.length,
      rejectedByCategory,
      rejectedUnhelpful,
      feedsFailed,
      seedLikesBumped,
      seedLikesDisabled,
      durationMs: Date.now() - startedAt,
    });

    return NextResponse.json({
      ok: true,
      inserted,
      skipped: classified.length - fresh.length,
      candidates: fresh.length,
      rejectedByCategory,
      rejectedUnhelpful,
      feedsFailed,
      seedLikesBumped,
      seedLikesDisabled,
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
