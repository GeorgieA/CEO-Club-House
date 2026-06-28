import type { RawArticle } from "./feeds";

const STOPWORDS = new Set([
  "der",
  "die",
  "das",
  "und",
  "oder",
  "in",
  "im",
  "ein",
  "eine",
  "mit",
  "von",
  "für",
  "fuer",
  "auf",
  "zu",
  "the",
  "a",
  "of",
  "to",
  "and",
  "in",
  "on",
  "for",
]);

function tokenize(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\s]/gi, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOPWORDS.has(token)),
  );
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return intersection / union;
}

// Niedrigere Schwelle = aggressiveres Dedupe. Schon bei geringerer
// Titel-Überlappung gilt ein Artikel als dieselbe Story und wird verworfen.
const SIMILARITY_THRESHOLD = 0.45;

export function dedupeBySimilarity(articles: RawArticle[]): RawArticle[] {
  // Neueste zuerst, damit bei Duplikaten der frischere Artikel bleibt.
  const sorted = [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const kept: { article: RawArticle; tokens: Set<string> }[] = [];

  for (const article of sorted) {
    const tokens = tokenize(article.title);
    const isDuplicate = kept.some(
      (entry) => jaccard(entry.tokens, tokens) >= SIMILARITY_THRESHOLD,
    );
    if (!isDuplicate) {
      kept.push({ article, tokens });
    }
  }

  return kept.map((entry) => entry.article);
}
