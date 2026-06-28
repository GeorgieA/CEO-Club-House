import Link from "next/link";
import AiBadge from "@/components/AiBadge";
import NewsCardReactions from "@/components/NewsCardReactions";
import { categoryBadgeClasses, type NewsItem } from "@/lib/data";
import { textSimilarity } from "@/lib/text-similarity";

interface NewsListProps {
  items: NewsItem[];
  userVotes?: Record<string, 1 | -1>;
  isLoggedIn?: boolean;
}

const HEADLINE_SUMMARY_THRESHOLD = 0.92;

function shouldShowSummary(headline: string, summary: string): boolean {
  const trimmed = summary?.trim() ?? "";
  if (trimmed.length === 0) return false;
  return textSimilarity(headline, trimmed) < HEADLINE_SUMMARY_THRESHOLD;
}

export default function NewsList({
  items,
  userVotes = {},
  isLoggedIn = false,
}: NewsListProps) {
  if (items.length === 0) {
    return (
      <section id="aktuell">
        <p className="mb-6 flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.12em] text-accent uppercase">
          <span className="h-[3px] w-[18px] rounded-sm bg-accent" />
          Aktuell
        </p>
        <p className="text-muted">
          Noch keine Artikel vorhanden. Der stündliche Import läuft automatisch.
        </p>
      </section>
    );
  }

  return (
    <section id="aktuell">
      <p className="mb-6 flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.12em] text-accent uppercase">
        <span className="h-[3px] w-[18px] rounded-sm bg-accent" />
        Aktuell
      </p>
      <div className="flex flex-col">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`group border-b border-line py-6 ${
              index === 0 ? "pt-0" : ""
            }`}
          >
            <div className="mb-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.85rem] text-muted">
              <span
                className={`rounded-md px-2.5 py-0.5 text-[0.72rem] font-bold uppercase ${categoryBadgeClasses[item.category]}`}
              >
                {item.categoryLabel}
              </span>
              <span>{item.time}</span>
              <NewsCardReactions
                articleId={item.id}
                slug={item.slug}
                initialLikes={item.likeCount ?? 0}
                initialDislikes={item.dislikeCount ?? 0}
                commentCount={item.commentCount ?? 0}
                initialUserVote={userVotes[item.id] ?? null}
                isLoggedIn={isLoggedIn}
              />
            </div>
            <Link href={`/news/${item.slug}`} className="block">
              <h2 className="mb-2 text-[1.3rem] leading-snug font-bold tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {item.headline}
              </h2>
              {shouldShowSummary(item.headline, item.summary) && (
                <p className="mb-2.5 text-base text-muted">{item.summary}</p>
              )}
              <AiBadge />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
