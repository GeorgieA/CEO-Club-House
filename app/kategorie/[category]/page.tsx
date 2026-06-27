import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NewsFeed from "@/components/NewsFeed";
import ScrollToTop from "@/components/ScrollToTop";
import Sidebar from "@/components/Sidebar";
import { getArticlesByCategory, getTrendingArticles } from "@/lib/articles";
import {
  CATEGORIES,
  categoryToNewsCategory,
  getCategoryDescription,
  getCategoryLabel,
  getCategoryMetaTitle,
  isCategorySlug,
} from "@/lib/categories";
import { defaultOgImage, getOgImageUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryParam } = await params;
  if (!isCategorySlug(categoryParam)) {
    return { title: "Kategorie nicht gefunden" };
  }

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/kategorie/${categoryParam}`;
  const title = getCategoryMetaTitle(categoryParam);
  const description = getCategoryDescription(categoryParam);
  const ogImage = getOgImageUrl();

  return {
    title,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: "CEO Clubhouse",
      locale: "de_DE",
      images: [{ ...defaultOgImage, url: ogImage, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: categoryParam } = await params;
  if (!isCategorySlug(categoryParam)) notFound();

  const category = categoryToNewsCategory(categoryParam);
  const [articles, trending] = await Promise.all([
    getArticlesByCategory(category, 200),
    getTrendingArticles(5),
  ]);

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/kategorie/${categoryParam}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: getCategoryMetaTitle(categoryParam),
    description: getCategoryDescription(categoryParam),
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "CEO Clubhouse",
      url: siteUrl,
    },
    hasPart: articles.slice(0, 20).map((article) => ({
      "@type": "NewsArticle",
      headline: article.headline,
      url: `${siteUrl}/news/${article.slug}`,
      datePublished: article.publishedAt,
    })),
  };

  return (
    <>
      <Header />
      <section className="mx-auto max-w-[1140px] px-6 py-8 md:py-14">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <p className="mb-3 text-[0.8rem] font-bold tracking-[0.12em] text-accent uppercase">
          Kategorie
        </p>
        <h1 className="mb-4 max-w-[20ch] text-[clamp(1.75rem,4vw,2.75rem)] leading-tight font-extrabold tracking-[-0.02em] text-ink">
          {getCategoryLabel(categoryParam)} News
        </h1>
        <p className="max-w-[60ch] text-lg text-muted">
          {getCategoryDescription(categoryParam)}
        </p>
      </section>
      <div className="mx-auto grid max-w-[1140px] grid-cols-1 items-start gap-10 border-t border-line px-6 pt-7 pb-16 lg:grid-cols-[1fr_360px] lg:gap-14 dark:border-line">
        <NewsFeed items={articles} initialCategory={category} />
        <Sidebar trending={trending} />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}
