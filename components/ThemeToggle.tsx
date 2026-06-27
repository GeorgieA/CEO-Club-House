"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("theme-change", onStoreChange);
  return () => window.removeEventListener("theme-change", onStoreChange);
}

function getDarkSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export default function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    getDarkSnapshot,
    getServerSnapshot,
  );

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark Mode umschalten"
      aria-pressed={dark}
      title="Dark Mode umschalten"
      className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border-[1.5px] border-ink bg-transparent text-lg text-ink transition-colors hover:bg-ink hover:text-accent"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
