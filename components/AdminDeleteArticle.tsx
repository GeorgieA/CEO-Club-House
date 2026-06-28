"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { checkIsAdmin, deleteArticle } from "@/app/news/actions";

interface AdminDeleteArticleProps {
  articleId: string;
  slug: string;
}

export default function AdminDeleteArticle({
  articleId,
  slug,
}: AdminDeleteArticleProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    checkIsAdmin()
      .then((result) => {
        if (active) setIsAdmin(result);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pending]);

  if (!isAdmin) return null;

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteArticle(articleId, slug);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-[0.8rem] font-bold tracking-[0.12em] text-muted uppercase">
        Admin
      </p>
      <button
        type="button"
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#dc2626] px-4 py-2.5 text-[0.9rem] font-bold text-[#dc2626] transition-colors hover:bg-[#dc2626] hover:text-white"
      >
        Artikel löschen
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onClick={() => {
            if (!pending) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="w-full max-w-[420px] rounded-[14px] border border-line bg-white p-6 shadow-xl dark:bg-[#181230]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-dialog-title"
              className="mb-2 text-lg font-extrabold tracking-[-0.01em] text-ink"
            >
              Artikel wirklich löschen?
            </h2>
            <p className="mb-6 text-sm text-muted">
              Der Artikel wird mit allen Likes und Kommentaren unwiderruflich
              gelöscht. Diese Aktion kann nicht rückgängig gemacht werden.
            </p>

            {error && (
              <p
                role="alert"
                className="mb-4 text-sm font-semibold text-[#dc2626]"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="inline-flex w-full justify-center rounded-[10px] bg-[#dc2626] px-5 py-3 text-[0.95rem] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
              >
                {pending ? "Wird gelöscht …" : "Endgültig löschen"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="inline-flex w-full justify-center rounded-[10px] border border-line px-5 py-3 text-[0.95rem] font-bold text-ink transition-colors hover:bg-line/40 disabled:opacity-60 sm:w-auto"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
