"use client";

import { openCookieSettings } from "@/lib/consent";

interface CookieSettingsLinkProps {
  className?: string;
}

export default function CookieSettingsLink({
  className,
}: CookieSettingsLinkProps) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie-Einstellungen
    </button>
  );
}
