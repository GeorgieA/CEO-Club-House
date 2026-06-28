"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { voteArticle } from "@/app/news/actions";
import { CommentIcon, ThumbDownIcon, ThumbUpIcon } from "@/components/icons";

interface NewsCardReactionsProps {
  articleId: string;
  slug: string;
  initialLikes: number;
  initialDislikes: number;
  commentCount: number;
  initialUserVote: 1 | -1 | null;
  isLoggedIn: boolean;
}

/**
 * Like-/Dislike-/Kommentar-Leiste für eine Artikelkarte in der Liste.
 * Liegt innerhalb des Karten-Links: Like/Dislike fangen den Klick ab und voten
 * inline (ohne Navigation), das Kommentar-Icon öffnet die Artikelseite.
 */
export default function NewsCardReactions({
  articleId,
  slug,
  initialLikes,
  initialDislikes,
  commentCount,
  initialUserVote,
  isLoggedIn,
}: NewsCardReactionsProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userVote, setUserVote] = useState<1 | -1 | null>(initialUserVote);
  const [pending, startTransition] = useTransition();

  function handleVote(event: React.MouseEvent, vote: 1 | -1) {
    // Karten-Link-Navigation unterbinden – nur voten.
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const prev = { likes, dislikes, userVote };

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
        setLikes(prev.likes);
        setDislikes(prev.dislikes);
        setUserVote(prev.userVote);
      }
    });
  }

  function handleComment(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/news/${slug}#kommentare`);
  }

  return (
    <span className="ml-0.5 inline-flex items-center gap-x-2.5">
      <button
        type="button"
        disabled={pending}
        onClick={(event) => handleVote(event, 1)}
        aria-pressed={userVote === 1}
        aria-label={`${likes} Likes`}
        className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-ink disabled:cursor-not-allowed ${
          userVote === 1 ? "font-semibold text-accent" : ""
        }`}
      >
        <ThumbUpIcon className="h-3.5 w-3.5" />
        {likes}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={(event) => handleVote(event, -1)}
        aria-pressed={userVote === -1}
        aria-label={`${dislikes} Dislikes`}
        className={`inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-ink disabled:cursor-not-allowed ${
          userVote === -1 ? "font-semibold text-accent" : ""
        }`}
      >
        <ThumbDownIcon className="h-3.5 w-3.5" />
        {dislikes}
      </button>
      <button
        type="button"
        onClick={handleComment}
        aria-label={`${commentCount} Kommentare`}
        className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-ink"
      >
        <CommentIcon className="h-3.5 w-3.5" />
        {commentCount}
      </button>
    </span>
  );
}
