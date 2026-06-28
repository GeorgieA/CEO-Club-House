"use client";

import Image from "next/image";
import Link from "next/link";
import AuthNav from "./AuthNav";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="site-header sticky top-0 z-[100] border-b border-line bg-white/90 backdrop-blur-sm">
      <div className="relative mx-auto flex h-[72px] max-w-[1140px] items-center justify-between gap-6 px-6 md:h-[132px]">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CEO Clubhouse"
            width={96}
            height={104}
            className="h-[56px] w-auto md:h-[104px]"
            priority
          />
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AuthNav />
        </div>
      </div>
    </header>
  );
}
