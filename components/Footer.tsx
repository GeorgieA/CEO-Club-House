import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "#", label: "Impressum" },
  { href: "#", label: "Datenschutz" },
  { href: "#", label: "Kontakt" },
  { href: "#", label: "Über uns" },
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
        </nav>
        <span className="text-[0.85rem] text-muted">© 2026 CEO Clubhouse</span>
      </div>
    </footer>
  );
}
