import type { MetadataRoute } from "next";
import { getAllArticlesForSitemap } from "@/lib/articles";
import { CATEGORIES } from "@/lib/categories";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const articles = await getAllArticlesForSitemap();

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...CATEGORIES.map((category) => ({
      url: `${siteUrl}/kategorie/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/news/${article.slug}`,
      lastModified: new Date(article.published_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
