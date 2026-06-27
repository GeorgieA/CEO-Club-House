"use client";

import { useMemo, useState } from "react";
import CategoryFilter from "@/components/CategoryFilter";
import NewsList from "@/components/NewsList";
import type { NewsCategory, NewsItem } from "@/lib/data";

const PAGE_SIZE = 20;

interface NewsFeedProps {
  items: NewsItem[];
  initialCategory?: NewsCategory | null;
  preferredCategories?: NewsCategory[];
}

export default function NewsFeed({
  items,
  initialCategory = null,
  preferredCategories = [],
}: NewsFeedProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | null>(
    initialCategory,
  );
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredItems = useMemo(() => {
    if (activeCategory) {
      return items.filter((item) => item.category === activeCategory);
    }
    if (preferredCategories.length > 0) {
      return items.filter((item) =>
        preferredCategories.includes(item.category),
      );
    }
    return items;
  }, [activeCategory, items, preferredCategories]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = filteredItems.length > visibleCount;

  const handleCategoryChange = (category: NewsCategory | null) => {
    setActiveCategory(category);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <>
      <CategoryFilter
        activeCategory={activeCategory}
        onChange={handleCategoryChange}
      />
      <NewsList items={visibleItems} />
      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="rounded-[10px] border-[1.5px] border-ink bg-white px-6 py-3 text-[0.95rem] font-bold text-ink transition-colors hover:bg-ink hover:text-accent dark:bg-[#181230] dark:hover:bg-ink"
          >
            Mehr laden
          </button>
        </div>
      )}
    </>
  );
}
