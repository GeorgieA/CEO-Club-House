"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  getUserVote,
  getVoteCounts,
  voteArticle,
} from "@/app/news/actions";
import { createClient } from "@/lib/supabase/client";

interface ArticleReactionsProps {
  articleId: string;
  slug: string;
}

export default function ArticleReactions({ articleId, slug }: ArticleReactionsProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userVote, setUserVote] = useState<1 | -1 | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    getVoteCounts(articleId).then(({ likes: l, dislikes: d }) => {
      setLikes(l);
      setDislikes(d);
    });

    getUserVote(articleId).then(setUserVote);
  }, [articleId]);

  function handleVote(vote: 1 | -1) {
    if (!isLoggedIn) return;

    startTransition(async () => {
      const result = await voteArticle(articleId, vote, slug);
      if (result.error) return;

      const [counts, currentVote] = await Promise.all([
        getVoteCounts(articleId),
        getUserVote(articleId),
      ]);
      setLikes(counts.likes);
      setDislikes(counts.dislikes);
      setUserVote(currentVote);
      router.refresh();
    });
  }

  return (
    <section className="mt-10 border-t border-line pt-8">
      <p className="mb-4 text-sm font-bold tracking-[0.12em] text-accent uppercase">
        Reaktionen
      </p>

      {!isLoggedIn && (
        <p className="mb-4 text-sm text-muted">
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Anmelden
          </Link>
          , um zu liken oder zu disliken.
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!isLoggedIn || pending}
          onClick={() => handleVote(1)}
          aria-pressed={userVote === 1}
          className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            userVote === 1
              ? "border-ink bg-ink text-accent"
              : "border-line bg-white text-ink hover:border-ink dark:bg-[#181230]"
          }`}
        >
          <span aria-hidden>👍</span>
          {likes}
        </button>
        <button
          type="button"
          disabled={!isLoggedIn || pending}
          onClick={() => handleVote(-1)}
          aria-pressed={userVote === -1}
          className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            userVote === -1
              ? "border-ink bg-ink text-accent"
              : "border-line bg-white text-ink hover:border-ink dark:bg-[#181230]"
          }`}
        >
          <span aria-hidden>👎</span>
          {dislikes}
        </button>
      </div>
    </section>
  );
}
