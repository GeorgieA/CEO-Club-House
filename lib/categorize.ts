import type { NewsCategory } from "./data";

const keywordMap: Record<NewsCategory, string[]> = {
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
    "konzern",
    "wirtschaft",
    "economy",
    "revenue",
    "unternehmen",
    "gründer",
    "gruender",
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
    "browser",
    "betriebssystem",
    "cybersecurity",
    "quantum",
    "technologie",
    "tech",
  ],
  trend: [
    "nachhaltigkeit",
    "esg",
    "klima",
    "energiewende",
    "inflation",
    "zinsen",
    "ezb",
    "konsum",
    "einzelhandel",
    "demografie",
    "migration",
    "gesellschaft",
    "regulierung",
    "arbeitsmarkt",
    "lieferkette",
    "rohstoff",
    "immobilienmarkt",
    "klimawandel",
    "co2",
    "emission",
    "markttrend",
    "verbraucher",
    "handel",
  ],
};

const categoryPriority: NewsCategory[] = ["ai", "business", "tech", "trend"];

const exclusionKeywords = [
  // Sport
  "fußball",
  "fussball",
  "bundesliga",
  "champions league",
  "formel 1",
  "wm 20",
  "olympia",
  "tennis",
  "basketball",
  // Kriminalität / Lokales
  "mord",
  "festnahme",
  "polizei",
  "unfall",
  "tötung",
  "toetung",
  "brandstiftung",
  "kriminal",
  // Promi / Tabloid
  "royals",
  "skandal",
  "promi",
  "star ",
  "schauspieler",
  "sängerin",
  "saengerin",
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

function isExcluded(title: string, description: string): boolean {
  const haystack = `${title} ${description}`.toLowerCase();
  return exclusionKeywords.some((keyword) => keywordMatches(haystack, keyword));
}

function matchCategory(haystack: string): NewsCategory | null {
  for (const category of categoryPriority) {
    const hit = keywordMap[category].some((keyword) =>
      keywordMatches(haystack, keyword),
    );
    if (hit) return category;
  }
  return null;
}

export function classifyArticle(
  title: string,
  description: string,
  feedCategory?: NewsCategory,
): NewsCategory | null {
  if (isExcluded(title, description)) {
    return null;
  }

  const haystack = `${title} ${description}`.toLowerCase();
  const keywordCategory = matchCategory(haystack);
  if (keywordCategory) return keywordCategory;

  if (feedCategory) return feedCategory;

  return null;
}
