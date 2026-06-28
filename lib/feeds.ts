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
    name: "Google News Tech Unternehmen",
    url: "https://news.google.com/rss/search?q=Technologie+Unternehmen+OR+Software+Startup&hl=de&gl=DE&ceid=DE:de",
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
    url: "https://news.google.com/rss/search?q=K%C3%BCnstliche+Intelligenz+Unternehmen&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  {
    name: "Google News ChatGPT",
    url: "https://news.google.com/rss/search?q=ChatGPT+OR+OpenAI+OR+Anthropic&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  {
    name: "Google News Machine Learning",
    url: "https://news.google.com/rss/search?q=Machine+Learning+Business&hl=de&gl=DE&ceid=DE:de",
    category: "ai",
  },
  // Business
  {
    name: "Google News Startups",
    url: "https://news.google.com/rss/search?q=Startup+Funding+OR+Venture+Capital&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  {
    name: "Google News Unternehmen",
    url: "https://news.google.com/rss/search?q=Unternehmen+Wirtschaft+CEO&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  {
    name: "Google News M&A",
    url: "https://news.google.com/rss/search?q=%C3%9Cbernahme+OR+IPO+OR+Finanzierung&hl=de&gl=DE&ceid=DE:de",
    category: "business",
  },
  // Trends (Wirtschaft & Gesellschaft)
  {
    name: "Google News Nachhaltigkeit",
    url: "https://news.google.com/rss/search?q=Nachhaltigkeit+OR+ESG+Unternehmen&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
  {
    name: "Google News Konsum",
    url: "https://news.google.com/rss/search?q=Konsum+OR+Einzelhandel+Wirtschaft&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
  {
    name: "Google News Inflation",
    url: "https://news.google.com/rss/search?q=Inflation+OR+EZB+OR+Zinsen&hl=de&gl=DE&ceid=DE:de",
    category: "trend",
  },
];

/** SEO-Farmen und reine Aktien-Tipp-Seiten — keine CEO-relevanten Quellen. */
const BLOCKED_DOMAINS = [
  "aktien.news",
  "ad-hoc-news.de",
  "ad-hoc-news.com",
  "boerse-express.com",
  "boerse-express.de",
  "kapitalmarkt-informationen.de",
];

function isBlockedUrl(link: string): boolean {
  if (!link) return true;
  try {
    const host = new URL(link).hostname.replace(/^www\./, "").toLowerCase();
    return BLOCKED_DOMAINS.some(
      (domain) => host === domain || host.endsWith(`.${domain}`),
    );
  } catch {
    return false;
  }
}

/**
 * Automatisierte Aktien-/Finanz-Ticker und SEO-Seiten. Da Google-News-Links
 * über news.google.com laufen, greift die Domain-Sperre dort nicht – deshalb
 * filtern wir zusätzlich über den (aus dem Titel extrahierten) Publisher.
 */
const BLOCKED_PUBLISHERS = [
  "börse express",
  "boerse express",
  "börse global",
  "boerse global",
  "börse online",
  "boerse online",
  "börse-online",
  "aktien.news",
  "ad-hoc-news",
  "marketscreener",
  "investing.com",
  "wallstreet-online",
  "wallstreet online",
  "finanztrends",
  "4investors",
  "der aktionär",
  "der aktionaer",
  "finanzen.net",
  "finanznachrichten",
  "boersengefluester",
];

function isBlockedPublisher(source: string): boolean {
  const normalized = source.toLowerCase();
  return BLOCKED_PUBLISHERS.some((publisher) => normalized.includes(publisher));
}

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

/**
 * Google News hängt an jeden Titel " - Publisher" an. Das gehört nicht in die
 * Headline. Wir trennen den Publisher ab und nutzen ihn als echte Quelle.
 */
function splitTitleAndPublisher(rawTitle: string): {
  title: string;
  publisher: string | null;
} {
  const idx = rawTitle.lastIndexOf(" - ");
  if (idx > 20) {
    const publisher = rawTitle.slice(idx + 3).trim();
    const isPlausiblePublisher =
      publisher.length > 0 &&
      publisher.length <= 50 &&
      !/[.!?:]$/.test(publisher) &&
      publisher.split(/\s+/).length <= 6;
    if (isPlausiblePublisher) {
      return { title: rawTitle.slice(0, idx).trim(), publisher };
    }
  }
  return { title: rawTitle, publisher: null };
}

async function fetchFeed(source: FeedSource): Promise<RawArticle[]> {
  const feed = await parser.parseURL(source.url);
  const isGoogleNews = source.url.includes("news.google.com");

  return (feed.items ?? []).map((item) => {
    const rawTitle = stripHtml(item.title) || "Ohne Titel";
    const { title, publisher } = isGoogleNews
      ? splitTitleAndPublisher(rawTitle)
      : { title: rawTitle, publisher: null };

    return {
      title: title || "Ohne Titel",
      description: stripHtml(
        item.contentSnippet || item.content || item.summary || "",
      ).slice(0, 600),
      link: item.link ?? "",
      source: publisher ?? source.name,
      publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      feedCategory: source.category,
    };
  });
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
    articles: articles.filter(
      (a) =>
        a.title &&
        a.title !== "Ohne Titel" &&
        !isBlockedUrl(a.link) &&
        !isBlockedPublisher(a.source),
    ),
    feedResults,
  };
}
