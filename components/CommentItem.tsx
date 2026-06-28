"use client";

import { useState } from "react";
import CommentMenu from "@/components/CommentMenu";
import { ThumbUpIcon } from "@/components/icons";
import { relativeTime } from "@/lib/time";

export interface CommentNode {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profiles: {
    username: string;
    business_url: string | null;
  };
}

interface CommentItemProps {
  comment: CommentNode;
  replies?: CommentNode[];
  userId: string | null;
  isLoggedIn: boolean;
  likeCounts: Record<string, number>;
  likedIds: Set<string>;
  pending: boolean;
  isReply?: boolean;
  onLike: (commentId: string) => void;
  onReply: (parentId: string, body: string) => Promise<boolean>;
  onDelete: (commentId: string) => void;
  onReport: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  replies = [],
  userId,
  isLoggedIn,
  likeCounts,
  likedIds,
  pending,
  isReply = false,
  onLike,
  onReply,
  onDelete,
  onReport,
}: CommentItemProps) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");

  const likeCount = likeCounts[comment.id] ?? 0;
  const likedByMe = likedIds.has(comment.id);

  async function handleReplySubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await onReply(comment.id, replyBody);
    if (ok) {
      setReplyBody("");
      setReplyOpen(false);
    }
  }

  return (
    <article
      className={`rounded-xl border border-line bg-[#fafbfc] p-4 dark:bg-[#181230] ${
        isReply ? "" : ""
      }`}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold text-ink">@{comment.profiles.username}</span>
        {comment.profiles.business_url && (
          <span className="text-muted">· {comment.profiles.business_url}</span>
        )}
        <span className="text-muted">· {relativeTime(comment.created_at)}</span>
        <CommentMenu
          canDelete={userId === comment.user_id}
          disabled={pending}
          onReport={() => onReport(comment.id)}
          onDelete={() => onDelete(comment.id)}
        />
      </div>

      <p className="whitespace-pre-wrap text-ink">{comment.body}</p>

      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          disabled={pending}
          onClick={() => onLike(comment.id)}
          aria-pressed={likedByMe}
          className={`flex items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
            likedByMe
              ? "border-ink bg-ink text-accent"
              : "border-line bg-white text-ink hover:border-ink dark:bg-[#181230]"
          }`}
        >
          <ThumbUpIcon className="h-3.5 w-3.5" />
          {likeCount > 0 ? likeCount : ""}
        </button>

        {!isReply && (
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="text-xs font-semibold text-muted transition-colors hover:text-accent"
          >
            Antworten
          </button>
        )}
      </div>

      {replyOpen && !isReply && (
        <form onSubmit={handleReplySubmit} className="mt-3 flex flex-col gap-2">
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder={
              isLoggedIn ? "Deine Antwort …" : "Anmelden, um zu antworten."
            }
            disabled={!isLoggedIn || pending}
            maxLength={2000}
            rows={2}
            required
            className="w-full resize-y rounded-[10px] border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-accent disabled:opacity-60 dark:bg-[#181230]"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isLoggedIn || pending || !replyBody.trim()}
              className="self-start rounded-[10px] bg-ink px-4 py-2 text-xs font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              Antworten
            </button>
            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="self-start rounded-[10px] border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:text-ink"
            >
              Abbrechen
            </button>
          </div>
        </form>
      )}

      {replies.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 border-l border-line pl-4">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              userId={userId}
              isLoggedIn={isLoggedIn}
              likeCounts={likeCounts}
              likedIds={likedIds}
              pending={pending}
              isReply
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              onReport={onReport}
            />
          ))}
        </div>
      )}
    </article>
  );
}
