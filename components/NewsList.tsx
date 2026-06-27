import Link from "next/link";
import { categoryBadgeClasses, type NewsItem } from "@/lib/data";

interface NewsListProps {
  items: NewsItem[];
}

export default function NewsList({ items }: NewsListProps) {
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
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className={`group block border-b border-line py-6 ${
              index === 0 ? "pt-0" : ""
            }`}
          >
            <div className="mb-2.5 flex items-center gap-2.5 text-[0.85rem] text-muted">
              <span
                className={`rounded-md px-2.5 py-0.5 text-[0.72rem] font-bold uppercase ${categoryBadgeClasses[item.category]}`}
              >
                {item.categoryLabel}
              </span>
              <span>{item.time}</span>
              <span>· {item.source}</span>
            </div>
            <h2 className="mb-2 text-[1.3rem] leading-snug font-bold tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
              {item.headline}
            </h2>
            <p className="text-base text-muted">{item.summary}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
