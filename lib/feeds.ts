import Parser from "rss-parser";

export interface FeedSource {
  name: string;
  url: string;
}

export interface RawArticle {
  title: string;
  description: string;
  link: string;
  source: string;
  publishedAt: string;
}

export const feedSources: FeedSource[] = [
  {
    name: "Google News",
    url: "https://news.google.com/rss?hl=de&gl=DE&ceid=DE:de",
  },
  {
    name: "Reuters",
    url: "https://www.reutersagency.com/feed/?best-topics=business-finance&post_type=best",
  },
  {
    name: "Spiegel",
    url: "https://www.spiegel.de/schlagzeilen/tops/index.rss",
  },
  {
    name: "Zeit",
    url: "https://newsfeed.zeit.de/index",
  },
  {
    name: "BBC",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
  },
];

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; CEOClubhouseBot/1.0; +https://ceo-clubhouse.example)",
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
  }));
}

export async function fetchAllFeeds(): Promise<RawArticle[]> {
  const results = await Promise.allSettled(feedSources.map(fetchFeed));

  const articles: RawArticle[] = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.warn(
        `[feeds] Quelle "${feedSources[index].name}" fehlgeschlagen:`,
        result.reason instanceof Error
          ? result.reason.message
          : result.reason,
      );
    }
  });

  return articles.filter((a) => a.title && a.title !== "Ohne Titel");
}
