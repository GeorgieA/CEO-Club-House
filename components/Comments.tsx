"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { addComment, deleteComment, getComments } from "@/app/news/actions";
import { createClient } from "@/lib/supabase/client";
import { relativeTime } from "@/lib/time";

interface CommentRow {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    business_url: string | null;
  };
}

interface CommentsProps {
  articleId: string;
  slug: string;
}

export default function Comments({ articleId, slug }: CommentsProps) {
  const router = useRouter();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
      setUserId(user?.id ?? null);
    });

    getComments(articleId).then(setComments);
  }, [articleId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await addComment(articleId, body, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setBody("");
      const updated = await getComments(articleId);
      setComments(updated);
      router.refresh();
    });
  }

  function handleDelete(commentId: string) {
    startTransition(async () => {
      const result = await deleteComment(commentId, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      router.refresh();
    });
  }

  return (
    <section id="kommentare" className="mt-10 scroll-mt-24 border-t border-line pt-8">
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
          {error && (
            <p role="alert" className="text-sm font-semibold text-[#dc2626]">
              {error}
            </p>
          )}
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
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Anmelden
          </Link>
          , um zu kommentieren.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {comments.length === 0 && (
          <p className="text-sm text-muted">Noch keine Kommentare.</p>
        )}
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-xl border border-line bg-[#fafbfc] p-4 dark:bg-[#181230]"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-ink">
                @{comment.profiles.username}
              </span>
              {comment.profiles.business_url && (
                <span className="text-muted">
                  · {comment.profiles.business_url}
                </span>
              )}
              <span className="text-muted">
                · {relativeTime(comment.created_at)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-ink">{comment.body}</p>
            {userId === comment.user_id && (
              <button
                type="button"
                onClick={() => handleDelete(comment.id)}
                disabled={pending}
                className="mt-2 text-xs font-semibold text-muted transition-colors hover:text-[#dc2626]"
              >
                Löschen
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
