"use client";

import type { NewsCategory } from "@/lib/data";
import { CATEGORIES } from "@/lib/categories";

interface CategoryFilterProps {
  activeCategory: NewsCategory | null;
  onChange: (category: NewsCategory | null) => void;
}

export default function CategoryFilter({
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="-mx-1 mb-6 overflow-x-auto px-1 pb-1">
      <div className="flex flex-nowrap gap-2">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            activeCategory === null
              ? "bg-ink text-accent"
              : "border border-line bg-white text-muted hover:border-ink hover:text-ink dark:bg-[#181230]"
          }`}
        >
          Alle
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => onChange(category.slug)}
            className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === category.slug
                ? "bg-ink text-accent"
                : "border border-line bg-white text-muted hover:border-ink hover:text-ink dark:bg-[#181230]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
