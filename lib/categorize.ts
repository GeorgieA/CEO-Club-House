import type { NewsCategory } from "./data";

const keywordMap: Record<Exclude<NewsCategory, "trend">, string[]> = {
  ai: [
    "ki",
    "k.i.",
    "künstliche intelligenz",
    "gpt",
    "chatgpt",
    "gemini",
    "openai",
    "claude",
    "anthropic",
    "machine learning",
    "maschinelles lernen",
    "deep learning",
    "neural",
    "neuronale",
    "llm",
    "sprachmodell",
    "copilot",
    "midjourney",
    "deepmind",
    "mistral",
    "artificial intelligence",
  ],
  business: [
    "startup",
    "start-up",
    "venture",
    "vc",
    "funding",
    "finanzierung",
    "umsatz",
    "gewinn",
    "verlust",
    "börse",
    "boerse",
    "aktie",
    "m&a",
    "übernahme",
    "uebernahme",
    "merger",
    "ipo",
    "investor",
    "milliarde",
    "million euro",
    "quartalszahlen",
    "bilanz",
    "ceo",
    "konzern",
    "wirtschaft",
    "economy",
    "revenue",
  ],
  tech: [
    "iphone",
    "android",
    "software",
    "app",
    "chip",
    "halbleiter",
    "hardware",
    "cloud",
    "apple",
    "google",
    "microsoft",
    "samsung",
    "nvidia",
    "intel",
    "amd",
    "smartphone",
    "laptop",
    "gadget",
    "update",
    "browser",
    "betriebssystem",
    "cybersecurity",
    "datenschutz",
    "quantum",
    "tech",
  ],
};

const priority: Array<Exclude<NewsCategory, "trend">> = [
  "ai",
  "business",
  "tech",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wortgrenzen-Matcher: verhindert Teilstring-Treffer wie "ki" in "working".
const matcherCache = new Map<string, RegExp>();
function keywordMatches(haystack: string, keyword: string): boolean {
  let regex = matcherCache.get(keyword);
  if (!regex) {
    regex = new RegExp(
      `(?<![a-z0-9äöüß])${escapeRegExp(keyword)}(?![a-z0-9äöüß])`,
      "i",
    );
    matcherCache.set(keyword, regex);
  }
  return regex.test(haystack);
}

export function categorize(title: string, description: string): NewsCategory {
  const haystack = `${title} ${description}`.toLowerCase();

  for (const category of priority) {
    const hit = keywordMap[category].some((keyword) =>
      keywordMatches(haystack, keyword),
    );
    if (hit) return category;
  }

  return "trend";
}
