import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AdminDeleteArticle from "@/components/AdminDeleteArticle";
import AiBadge from "@/components/AiBadge";
import ArticleReactions from "@/components/ArticleReactions";
import Comments from "@/components/Comments";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { getArticleBySlug, getAllSlugs } from "@/lib/articles";
import { categoryBadgeClasses, categoryLabels } from "@/lib/data";
import { defaultOgImage, getOgImageUrl } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { relativeTime } from "@/lib/time";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Artikel nicht gefunden" };

  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/news/${article.slug}`;
  const title = `${article.title} | CEO Clubhouse`;
  const description = article.summary;

  const ogImage = getOgImageUrl();

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "CEO Clubhouse",
      locale: "de_DE",
      publishedTime: article.published_at,
      section: categoryLabels[article.category],
      images: [{ ...defaultOgImage, url: ogImage, alt: article.title }],
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

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/news/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    datePublished: article.published_at,
    dateModified: article.created_at,
    articleSection: categoryLabels[article.category],
    author: {
      "@type": "Organization",
      name: article.source,
    },
    publisher: {
      "@type": "Organization",
      name: "CEO Clubhouse",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: getOgImageUrl(),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    url: pageUrl,
    isBasedOn: article.source_url,
  };

  return (
    <>
      <Header />
      <article className="mx-auto max-w-[760px] px-6 py-14 pb-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Link
          href="/"
          className="mb-8 inline-flex text-sm font-semibold text-muted transition-colors hover:text-accent"
        >
          ← Zurück zur Übersicht
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-2.5 text-[0.85rem] text-muted">
          <span
            className={`rounded-md px-2.5 py-0.5 text-[0.72rem] font-bold uppercase ${categoryBadgeClasses[article.category]}`}
          >
            {categoryLabels[article.category]}
          </span>
          <span>{relativeTime(article.published_at)}</span>
          <span>· {article.source}</span>
        </div>

        <h1 className="mb-6 text-[clamp(1.75rem,4vw,2.5rem)] leading-tight font-extrabold tracking-[-0.02em] text-ink">
          {article.title}
        </h1>

        <div className="mb-8">
          <p className="mb-3 text-lg leading-relaxed text-muted">
            {article.summary}
          </p>
          <AiBadge />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={article.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center rounded-[10px] bg-ink px-5 py-3 text-[0.95rem] font-bold text-accent transition-opacity hover:opacity-90 sm:w-auto"
          >
            Zur Originalquelle →
          </a>
        </div>

        <ArticleReactions
          articleId={article.id}
          slug={article.slug}
          shareUrl={pageUrl}
          shareTitle={article.title}
          shareText={article.summary}
        />

        <AdminDeleteArticle articleId={article.id} slug={article.slug} />

        <Comments articleId={article.id} slug={article.slug} />
      </article>
      <Footer />
      <ScrollToTop />
    </>
  );
}
