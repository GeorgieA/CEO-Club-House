import type { NewsCategory } from "@/lib/data";

export const CATEGORIES = [
  { slug: "tech" as const, label: "Tech" },
  { slug: "ai" as const, label: "AI" },
  { slug: "business" as const, label: "Business" },
  { slug: "trend" as const, label: "Trends" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORIES.some((category) => category.slug === value);
}

export function getCategoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((category) => category.slug === slug)?.label ?? slug;
}

export function getCategoryDescription(slug: CategorySlug): string {
  const descriptions: Record<CategorySlug, string> = {
    tech: "Die neuesten Tech-News für Entscheider — Hardware, Software und Innovation.",
    ai: "KI-News und Künstliche Intelligenz — Updates für Gründer und CEOs.",
    business: "Business-News aus Wirtschaft, Startups und Unternehmensführung.",
    trend: "Trends und Entwicklungen, die Gründer und CEOs kennen sollten.",
  };
  return descriptions[slug];
}

export function getCategoryMetaTitle(slug: CategorySlug): string {
  return `${getCategoryLabel(slug)} News | CEO Clubhouse`;
}

export function categoryToNewsCategory(slug: CategorySlug): NewsCategory {
  return slug;
}
