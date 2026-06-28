"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  EmailIcon,
  FacebookIcon,
  LinkedInIcon,
  LinkIcon,
  RedditIcon,
  ShareIcon,
  TelegramIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";

interface ShareButtonProps {
  url: string;
  title: string;
  text?: string;
}

interface ShareTarget {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  className: string;
}

function buildTargets(url: string, title: string, text: string): ShareTarget[] {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  // Plattformspezifische Texte, damit der Post jeweils sauber aussieht.
  const xText = encodeURIComponent(`${title}\n\n#CEOClubhouse`);
  const waText = encodeURIComponent(`${title}\n${url}`);
  const tgText = encodeURIComponent(title);
  const mailSubject = encodeURIComponent(title);
  const mailBody = encodeURIComponent(
    `${text ? `${text}\n\n` : ""}Zum Artikel: ${url}`,
  );

  return [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${waText}`,
      icon: <WhatsAppIcon />,
      className: "text-[#25D366]",
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${xText}`,
      icon: <XIcon />,
      className: "text-ink",
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: <FacebookIcon />,
      className: "text-[#1877F2]",
    },
    {
      id: "reddit",
      label: "Reddit",
      href: `https://www.reddit.com/submit?url=${u}&title=${t}`,
      icon: <RedditIcon />,
      className: "text-[#FF4500]",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: <LinkedInIcon />,
      className: "text-[#0A66C2]",
    },
    {
      id: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${u}&text=${tgText}`,
      icon: <TelegramIcon />,
      className: "text-[#26A5E4]",
    },
    {
      id: "email",
      label: "E-Mail",
      href: `mailto:?subject=${mailSubject}&body=${mailBody}`,
      icon: <EmailIcon />,
      className: "text-muted",
    },
  ];
}

export default function ShareButton({ url, title, text }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return true;
      } catch {
        // Abgebrochen oder nicht möglich – Menü zeigen.
      }
    }
    return false;
  }

  async function handleTrigger() {
    // Auf Mobilgeräten direkt das native Share-Sheet, sonst das Menü.
    const isMobile =
      typeof navigator !== "undefined" &&
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile && (await handleNativeShare())) return;
    setOpen((prev) => !prev);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard nicht verfügbar
    }
  }

  const targets = buildTargets(url, title, text ?? title);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Artikel teilen"
        className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink dark:bg-[#181230]"
      >
        <ShareIcon />
        Teilen
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[14px] border border-line bg-white p-1.5 shadow-lg dark:bg-[#181230]"
        >
          {targets.map((target) => (
            <a
              key={target.id}
              href={target.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-line/60"
            >
              <span className={target.className}>{target.icon}</span>
              {target.label}
            </a>
          ))}

          <button
            type="button"
            role="menuitem"
            onClick={handleCopy}
            className="flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-line/60"
          >
            <span className="text-muted">
              {copied ? <CheckIcon /> : <LinkIcon />}
            </span>
            {copied ? "Link kopiert" : "Link kopieren"}
          </button>
        </div>
      )}
    </div>
  );
}
