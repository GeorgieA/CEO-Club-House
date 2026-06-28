"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  getCommentCount,
  getUserVote,
  getVoteCounts,
  voteArticle,
} from "@/app/news/actions";
import { CommentIcon, ThumbDownIcon, ThumbUpIcon } from "@/components/icons";
import ShareButton from "@/components/ShareButton";
import { createClient } from "@/lib/supabase/client";

interface ArticleReactionsProps {
  articleId: string;
  slug: string;
  shareUrl: string;
  shareTitle: string;
  shareText?: string;
}

export default function ArticleReactions({
  articleId,
  slug,
  shareUrl,
  shareTitle,
  shareText,
}: ArticleReactionsProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
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

    getCommentCount(articleId).then(setCommentCount);
    getUserVote(articleId).then(setUserVote);
  }, [articleId]);

  function handleVote(vote: 1 | -1) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const prev = { likes, dislikes, userVote };

    // Optimistisches Update: lokalen Zustand sofort anpassen.
    let nextLikes = likes;
    let nextDislikes = dislikes;
    let nextVote: 1 | -1 | null;

    if (userVote === vote) {
      nextVote = null;
      if (vote === 1) nextLikes -= 1;
      else nextDislikes -= 1;
    } else {
      nextVote = vote;
      if (vote === 1) {
        nextLikes += 1;
        if (userVote === -1) nextDislikes -= 1;
      } else {
        nextDislikes += 1;
        if (userVote === 1) nextLikes -= 1;
      }
    }

    setLikes(nextLikes);
    setDislikes(nextDislikes);
    setUserVote(nextVote);

    startTransition(async () => {
      const result = await voteArticle(articleId, vote, slug);
      if (result.error) {
        // Bei Fehler zurückrollen.
        setLikes(prev.likes);
        setDislikes(prev.dislikes);
        setUserVote(prev.userVote);
      }
    });
  }

  return (
    <section className="mt-10 border-t border-line pt-8">
      <p className="mb-4 text-sm font-bold tracking-[0.12em] text-accent uppercase">
        Reaktionen
      </p>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={() => handleVote(1)}
          aria-pressed={userVote === 1}
          className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            userVote === 1
              ? "border-ink bg-ink text-accent"
              : "border-line bg-white text-ink hover:border-ink dark:bg-[#181230]"
          }`}
        >
          <ThumbUpIcon />
          {likes}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => handleVote(-1)}
          aria-pressed={userVote === -1}
          className={`flex items-center gap-2 rounded-[10px] border px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            userVote === -1
              ? "border-ink bg-ink text-accent"
              : "border-line bg-white text-ink hover:border-ink dark:bg-[#181230]"
          }`}
        >
          <ThumbDownIcon />
          {dislikes}
        </button>
        <a
          href="#kommentare"
          className="flex items-center gap-2 rounded-[10px] border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink dark:bg-[#181230]"
        >
          <CommentIcon />
          {commentCount}
        </a>
        <ShareButton url={shareUrl} title={shareTitle} text={shareText} />
      </div>
    </section>
  );
}
