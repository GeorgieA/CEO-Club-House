"use client";

import { useState } from "react";
import { CheckIcon, ShareIcon } from "@/components/icons";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
}

export default function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return;
      } catch {
        // Nutzer hat abgebrochen oder Share fehlgeschlagen — Fallback unten
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard nicht verfügbar — nichts zu tun
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Artikel teilen"
      className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink dark:bg-[#181230]"
    >
      {copied ? <CheckIcon /> : <ShareIcon />}
      {copied ? "Link kopiert" : "Teilen"}
    </button>
  );
}
