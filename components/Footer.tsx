import Image from "next/image";
import Link from "next/link";
import CookieSettingsLink from "./CookieSettingsLink";

const footerLinks = [
  { href: "/impressum", label: "Impressum" },
  { href: "/datenschutz", label: "Datenschutz" },
  { href: "/agb", label: "AGB" },
  { href: "#", label: "Kontakt" },
];

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-line dark:border-line">
      <div className="mx-auto flex max-w-[1140px] flex-wrap items-center justify-between gap-4 px-6 py-8">
        <span className="flex items-center">
          <Image
            src="/logo.png"
            alt="CEO Clubhouse"
            width={56}
            height={60}
            className="h-14 w-auto"
          />
        </span>
        <nav className="flex flex-wrap gap-5">
          {footerLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[0.9rem] text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <CookieSettingsLink className="text-[0.9rem] text-muted transition-colors hover:text-ink" />
        </nav>
        <span className="flex items-center gap-4 text-[0.85rem] text-muted">
          <a
            href="https://www.finity-in.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-ink"
          >
            Webdesign
          </a>
          © 2026 CEO Clubhouse
        </span>
      </div>
    </footer>
  );
}
