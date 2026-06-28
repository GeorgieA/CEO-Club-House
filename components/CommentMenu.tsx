"use client";

import { useEffect, useRef, useState } from "react";

interface CommentMenuProps {
  canDelete: boolean;
  onReport: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export default function CommentMenu({
  canDelete,
  onReport,
  onDelete,
  disabled,
}: CommentMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Optionen"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md px-2 py-1 text-lg leading-none text-muted transition-colors hover:bg-line hover:text-ink"
      >
        ⋯
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-[10px] border border-line bg-white shadow-lg dark:bg-[#181230]"
        >
          <button
            type="button"
            role="menuitem"
            disabled={disabled}
            onClick={() => {
              setOpen(false);
              onReport();
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-ink transition-colors hover:bg-line disabled:opacity-50"
          >
            Melden
          </button>
          {canDelete && (
            <button
              type="button"
              role="menuitem"
              disabled={disabled}
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
              className="block w-full px-4 py-2.5 text-left text-sm text-[#dc2626] transition-colors hover:bg-line disabled:opacity-50"
            >
              Löschen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
