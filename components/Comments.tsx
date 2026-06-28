"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import CommentItem, { type CommentNode } from "@/components/CommentItem";
import {
  addComment,
  deleteComment,
  getCommentVoteCounts,
  getComments,
  getUserCommentVotes,
  reportComment,
  voteComment,
} from "@/app/news/actions";
import { createClient } from "@/lib/supabase/client";

interface CommentsProps {
  articleId: string;
  slug: string;
}

export default function Comments({ articleId, slug }: CommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const refreshComments = useCallback(async () => {
    const rows = await getComments(articleId);
    setComments(rows);

    const ids = rows.map((row) => row.id);
    const [counts, mine] = await Promise.all([
      getCommentVoteCounts(ids),
      getUserCommentVotes(ids),
    ]);
    setLikeCounts(counts);
    setLikedIds(new Set(mine));
  }, [articleId]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setUserId(user?.id ?? null);
    });
    refreshComments();
  }, [refreshComments]);

  const { topLevel, repliesByParent } = useMemo(() => {
    const tops: CommentNode[] = [];
    const map = new Map<string, CommentNode[]>();
    for (const comment of comments) {
      if (comment.parent_id) {
        const list = map.get(comment.parent_id) ?? [];
        list.push(comment);
        map.set(comment.parent_id, list);
      } else {
        tops.push(comment);
      }
    }
    return { topLevel: tops, repliesByParent: map };
  }, [comments]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    startTransition(async () => {
      const result = await addComment(articleId, body, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setBody("");
      await refreshComments();
      router.refresh();
    });
  }

  const handleReply = useCallback(
    async (parentId: string, replyBody: string): Promise<boolean> => {
      setError(null);
      setNotice(null);
      if (!isLoggedIn) {
        router.push("/login");
        return false;
      }
      const result = await addComment(articleId, replyBody, slug, parentId);
      if (result.error) {
        setError(result.error);
        return false;
      }
      await refreshComments();
      router.refresh();
      return true;
    },
    [articleId, slug, isLoggedIn, router, refreshComments],
  );

  const handleLike = useCallback(
    (commentId: string) => {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      const liked = likedIds.has(commentId);

      // Optimistisches Update: Like sofort umschalten.
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (liked) next.delete(commentId);
        else next.add(commentId);
        return next;
      });
      setLikeCounts((prev) => ({
        ...prev,
        [commentId]: Math.max(0, (prev[commentId] ?? 0) + (liked ? -1 : 1)),
      }));

      startTransition(async () => {
        const result = await voteComment(commentId, slug);
        if (result.error) {
          setError(result.error);
          // Rückrollen.
          setLikedIds((prev) => {
            const next = new Set(prev);
            if (liked) next.add(commentId);
            else next.delete(commentId);
            return next;
          });
          setLikeCounts((prev) => ({
            ...prev,
            [commentId]: Math.max(
              0,
              (prev[commentId] ?? 0) + (liked ? 1 : -1),
            ),
          }));
        }
      });
    },
    [isLoggedIn, slug, likedIds, router],
  );

  const handleDelete = useCallback(
    (commentId: string) => {
      startTransition(async () => {
        const result = await deleteComment(commentId, slug);
        if (result.error) {
          setError(result.error);
          return;
        }
        await refreshComments();
        router.refresh();
      });
    },
    [slug, refreshComments, router],
  );

  const handleReport = useCallback(
    (commentId: string) => {
      setError(null);
      setNotice(null);
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      startTransition(async () => {
        const result = await reportComment(commentId);
        if (result.error) {
          setError(result.error);
          return;
        }
        setNotice(result.success ?? "Danke, der Kommentar wurde gemeldet.");
        await refreshComments();
      });
    },
    [isLoggedIn, router, refreshComments],
  );

  return (
    <section
      id="kommentare"
      className="mt-10 scroll-mt-24 border-t border-line pt-8"
    >
      <p className="mb-4 text-sm font-bold tracking-[0.12em] text-accent uppercase">
        Kommentare ({comments.length})
      </p>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Dein Kommentar … (keine Links erlaubt)"
            maxLength={2000}
            rows={3}
            required
            className="w-full resize-y rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
          />
          <button
            type="submit"
            disabled={pending || !body.trim()}
            className="self-start rounded-[10px] bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Wird gesendet …" : "Kommentieren"}
          </button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-muted">
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Anmelden
          </Link>
          , um zu kommentieren.
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm font-semibold text-[#dc2626]">
          {error}
        </p>
      )}
      {notice && (
        <p className="mb-4 text-sm font-semibold text-accent">{notice}</p>
      )}

      <div className="flex flex-col gap-6">
        {topLevel.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            replies={repliesByParent.get(comment.id) ?? []}
            userId={userId}
            isLoggedIn={isLoggedIn}
            likeCounts={likeCounts}
            likedIds={likedIds}
            pending={pending}
            onLike={handleLike}
            onReply={handleReply}
            onDelete={handleDelete}
            onReport={handleReport}
          />
        ))}
      </div>
    </section>
  );
}
