"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import AuthNav from "./AuthNav";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  ...CATEGORIES.map((category) => ({
    href: `/kategorie/${category.slug}`,
    label: category.label,
    match: (path: string) => path === `/kategorie/${category.slug}`,
  })),
];

export default function Header() {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const closeNav = () => setNavOpen(false);

  return (
    <header className="site-header sticky top-0 z-[100] border-b border-line bg-white/90 backdrop-blur-sm">
      <div className="relative mx-auto flex h-[72px] max-w-[1140px] items-center justify-between gap-6 px-6 md:h-[132px]">
        <Link href="/" className="flex items-center" onClick={closeNav}>
          <Image
            src="/logo.png"
            alt="CEO Clubhouse"
            width={96}
            height={104}
            className="h-[56px] w-auto md:h-[104px]"
            priority
          />
        </Link>

        <nav
          id="nav"
          className={`ml-auto items-center gap-1 ${
            navOpen
              ? "absolute top-full right-0 left-0 flex flex-col gap-1 border-b border-line bg-white px-6 pt-3 pb-4 md:static md:flex md:flex-row md:border-0 md:p-0"
              : "hidden md:flex md:flex-row"
          }`}
        >
          {navLinks.map((link) => {
            const isActive = link.match(pathname);

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeNav}
                className={`rounded-lg px-3.5 py-2 text-[0.98rem] font-medium transition-colors ${
                  isActive
                    ? "bg-[#f1f5f9] text-ink"
                    : "text-muted hover:bg-[#f1f5f9] hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthNav />
          <button
            type="button"
            id="burger"
            aria-label={navOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={navOpen}
            onClick={() => setNavOpen((open) => !open)}
            className="flex h-[42px] w-[42px] flex-col items-center justify-center gap-[5px] rounded-[10px] border border-line bg-white p-[11px] md:hidden"
          >
            <span
              className={`block h-0.5 w-full bg-ink transition-transform ${
                navOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-ink transition-opacity ${
                navOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-ink transition-transform ${
                navOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
