"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Nach oben scrollen"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-6 z-50 flex h-[46px] w-[46px] items-center justify-center rounded-full border border-line bg-white text-lg shadow-[0_4px_16px_rgba(25,0,70,0.15)] transition-[opacity,transform] hover:-translate-y-0.5 dark:bg-[#181230] dark:text-ink ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
