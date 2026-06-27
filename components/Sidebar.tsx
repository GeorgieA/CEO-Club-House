import Link from "next/link";
import { trendingTopics } from "@/lib/data";
import NewsletterForm from "./NewsletterForm";

export default function Sidebar() {
  return (
    <aside className="flex flex-col gap-10">
      <section>
        <p className="mb-6 flex items-center gap-2 text-[0.8rem] font-bold tracking-[0.12em] text-accent uppercase">
          <span className="h-[3px] w-[18px] rounded-sm bg-accent" />
          Trending
        </p>
        <ol>
          {trendingTopics.map((topic) => (
            <li key={topic.id}>
              <Link
                href="#"
                className="group flex items-start gap-4 border-b border-line py-3.5 transition-colors last:border-b-0"
              >
                <span className="min-w-6 text-2xl leading-none font-extrabold text-[#cbd5e1] transition-colors group-hover:text-accent dark:text-[#4a3f70]">
                  {topic.id}
                </span>
                <span className="text-base leading-snug font-semibold text-ink transition-colors group-hover:text-accent">
                  {topic.title}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="newsletter"
        className="rounded-2xl border border-line bg-[#fafbfc] p-6 dark:bg-[#181230]"
      >
        <h3 className="mb-2 text-[1.15rem] font-bold text-ink">
          Täglich informiert
        </h3>
        <p className="mb-5 text-[0.95rem] text-muted">
          Die 5 wichtigsten News direkt in dein Postfach. Jeden Morgen um 7 Uhr.
        </p>
        <NewsletterForm />
      </section>
    </aside>
  );
}
