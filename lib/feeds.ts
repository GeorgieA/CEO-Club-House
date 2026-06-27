import Parser from "rss-parser";
import type { NewsCategory } from "@/lib/data";

export interface FeedSource {
  name: string;
  url: string;
  category: NewsCategory;
}

export interface RawArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
  feedCategory: NewsCategory;
}

export interface FeedResult {
  name: string;
  category: NewsCategory;
  status: "ok" | "error";
  count: number;
  error?: string;
}

export interface FetchAllFeedsResult {
  articles: RawArticle[];
  feedResults: FeedResult[];
}

export const feedSources: FeedSource[] = [
  // Tech
  {
    name: "Google News Technologie",
    url: "https://news.google.com/rss/search?q=Technologie&hl=de&gl=DE&ceid=DE:de",
    category: "tech",
  },
  {
    name: "t3n",
    url: "https://t3n.de/rss.xml",
    category: "tech",
  },
  {
    name: "Heise Top",
    url: "https://www.heise.de/rss/heise-top-atom.xml",
    category: "tech",
  },
  {
    name: "Golem",
    url: "https://rss.golem.de/rss.php?feed=RSS2.0",
    category: "tech",
  },
  // AI
  {
    name: "Google News KI",
    url: "https://news.google.com/rss/search?q=K%C3%BCnstliche+Intelligenz&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  {
    name: "Google News ChatGPT",
    url: "https://news.google.com/rss/search?q=ChatGPT+OR+OpenAI&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  {
    name: "Google News Machine Learning",
    url: "https://news.google.com/rss/search?q=Machine+Learning&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  // Business
  {
    name: "Google News Wirtschaft",
    url: "https://news.google.com/rss/search?q=Wirtschaft&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  {
    name: "Google News Startups",
    url: "https://news.google.com/rss/search?q=Startups&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  {
    name: "Google News Wirtschaft",
    url: "https://news.google.com/rss/search?q=Wirtschaft+Unternehmen&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  {
    name: "Google News Börse",
    url: "https://news.google.com/rss/search?q=B%C3%B6rse+OR+Aktien&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  // Trends (Wirtschaft & Gesellschaft)
  {
    name: "Google News Nachhaltigkeit",
    url: "https://news.google.com/rss/search?q=Nachhaltigkeit+OR+ESG&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
  {
    name: "Google News Konsum",
    url: "https://news.google.com/rss/search?q=Konsum+OR+Einzelhandel&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
  {
    name: "Google News Gesellschaft",
    url: "https://news.google.com/rss/search?q=Gesellschaft+OR+Demografie&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
  {
    name: "Google News Inflation",
    url: "https://news.google.com/rss/search?q=Inflation+OR+EZB+OR+Zinsen&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
];

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; CEOClubhouseBot/1.0; +https://ceo-club-house.vercel.app)",
  },
});

function stripHtml(input: string | undefined): string {
  if (!input) return "";
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchFeed(source: FeedSource): Promise<RawArticle[]> {
  const feed = await parser.parseURL(source.url);
  return (feed.items ?? []).map((item) => ({
    title: stripHtml(item.title) || "Ohne Titel",
    description: stripHtml(
      item.contentSnippet || item.content || item.summary || "",
    ).slice(0, 600),
    link: item.link ?? "",
    source: source.name,
    publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
    feedCategory: source.category,
  }));
}

export async function fetchAllFeeds(): Promise<FetchAllFeedsResult> {
  const results = await Promise.allSettled(feedSources.map(fetchFeed));

  const articles: RawArticle[] = [];
  const feedResults: FeedResult[] = results.map((result, index) => {
    const source = feedSources[index];

    if (result.status === "fulfilled") {
      articles.push(...result.value);
      return {
        name: source.name,
        category: source.category,
        status: "ok" as const,
        count: result.value.length,
      };
    }

    const errorMessage =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);

    console.warn(
      JSON.stringify({
        event: "feed.result",
        source: source.name,
        category: source.category,
        status: "error",
        count: 0,
        error: errorMessage,
      }),
    );

    return {
      name: source.name,
      category: source.category,
      status: "error" as const,
      count: 0,
      error: errorMessage,
    };
  });

  return {
    articles: articles.filter((a) => a.title && a.title !== "Ohne Titel"),
    feedResults,
  };
}
