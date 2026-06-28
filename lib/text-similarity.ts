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
  "on",
  "for",
]);

export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9äöüß\s]/gi, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOPWORDS.has(token)),
  );
}

export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection += 1;
  }
  const union = a.size + b.size - intersection;
  return intersection / union;
}

export function textSimilarity(a: string, b: string): number {
  return jaccardSimilarity(tokenize(a), tokenize(b));
}
