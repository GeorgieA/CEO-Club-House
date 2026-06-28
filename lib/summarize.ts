import type { GenerationConfig } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { textSimilarity } from "./text-similarity";

// Das alte SDK (@google/generative-ai) kennt thinkingConfig nicht in den Typen,
// reicht zusätzliche Felder aber an die REST-API durch.
type GenerationConfigWithThinking = GenerationConfig & {
  thinkingConfig?: { thinkingBudget: number };
};

export interface SummarizeInput {
  id: string;
  title: string;
  description: string;
}

export interface SummaryResult {
  summary: string;
  /** true = echte, von Gemini erzeugte Zusammenfassung; false = Fallback. */
  ai: boolean;
}

function fallbackSummary(description: string, title: string): string {
  const base = description?.trim() || title.trim();
  if (base.length <= 220) return base;
  const cut = base.slice(0, 220);
  const lastDot = cut.lastIndexOf(".");
  return (lastDot > 120 ? cut.slice(0, lastDot + 1) : cut.trim() + " …");
}

const CHUNK_SIZE = 5;

const META_PHRASES = [
  "der artikel",
  "dieser artikel",
  "dieser beitrag",
  "der beitrag",
  "der text",
  "bietet einen überblick",
  "bietet einen ueberblick",
  "beschreibt",
  "stellt dar",
  "gibt einen einblick",
];

function isAcceptableSummary(
  summary: string,
  title: string,
  description: string,
): boolean {
  const trimmed = summary.trim();
  if (trimmed.length < 80) return false;

  const lower = trimmed.toLowerCase();
  if (META_PHRASES.some((phrase) => lower.includes(phrase))) return false;

  // Nur near-verbatim Wiederholungen der Schlagzeile verwerfen. Eine gute
  // Zusammenfassung einer klaren, kurzen Headline ist zwangsläufig ähnlich –
  // deshalb hier bewusst tolerant.
  if (textSimilarity(trimmed, title) >= 0.85) return false;

  const desc = description.trim();
  if (desc.length > 0 && textSimilarity(trimmed, desc) >= 0.9) return false;

  return true;
}

/**
 * Entscheidet, ob ein Artikel echten Mehrwert bietet und gespeichert werden
 * soll. Eine echte Gemini-Zusammenfassung gilt immer als hilfreich. Beim
 * Fallback (Gemini nicht verfügbar/abgelehnt) zählt nur eine inhaltlich
 * tragfähige Originalbeschreibung – reine Titel-Wiederholungen fliegen raus.
 */
export function isHelpfulArticle(
  result: SummaryResult,
  title: string,
  description: string,
): boolean {
  if (result.ai) return true;

  const desc = description.trim();
  if (desc.length < 80) return false;
  if (textSimilarity(desc, title) >= 0.7) return false;
  return true;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function summarizeChunk(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  items: SummarizeInput[],
  extraInstructions: string,
): Promise<Map<string, string>> {
  const instructionsBlock = extraInstructions
    ? `\nZusätzliche Anweisungen der Redaktion (unbedingt befolgen, sofern sie dem JSON-Format nicht widersprechen):\n${extraInstructions}\n`
    : "";

  const prompt = `Du bist Redakteur für ein deutschsprachiges News-Briefing für CEOs und Gründer.
Fasse jeden der folgenden Artikel in 2-3 prägnanten deutschen Sätzen zusammen. Sachlich, ohne Floskeln, keine Anrede.

WICHTIG:
- Schreibe NIEMALS Meta-Text wie "Der Artikel beschreibt…", "Dieser Beitrag bietet…" oder "Der Text stellt dar…"
- Beantworte direkt: Was ist passiert? Wer ist betroffen? Was bedeutet das für Unternehmer?
- Nenne konkrete Fakten, Zahlen oder Akteure aus dem Input
- Mindestens 2 vollständige Sätze mit Substanz

Gib ausschließlich gültiges JSON zurück: ein Array von Objekten mit den Feldern "id" und "summary".
${instructionsBlock}
Artikel:
${items
  .map(
    (item) =>
      `- id: ${item.id}\n  titel: ${item.title}\n  beschreibung: ${item.description || "(keine)"}`,
  )
  .join("\n")}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.3,
      // Großzügig bemessen: deutsche Zusammenfassungen brauchen ~2-3 Zeichen pro
      // Token. Bei zu kleinem Budget wird das JSON mitten im String abgeschnitten
      // und der ganze Chunk fällt auf den Fallback zurück.
      maxOutputTokens: 4096,
      // "Thinking" deaktivieren – für Zusammenfassungen unnötig und teuer.
      // Das alte SDK kennt das Feld nicht in den Typen, reicht es aber durch.
      thinkingConfig: { thinkingBudget: 0 },
    } as GenerationConfigWithThinking,
  });

  const text = result.response.text();
  return parseSummaryJson(text);
}

/**
 * Tolerant gegenüber abgeschnittenem JSON: Versucht zuerst regulär zu parsen
 * und rettet andernfalls alle vollständigen {id, summary}-Objekte per Regex.
 * So gehen bei einer abgeschnittenen Antwort nicht alle Einträge verloren.
 */
function parseSummaryJson(text: string): Map<string, string> {
  const map = new Map<string, string>();

  const add = (id: unknown, summary: unknown) => {
    if (typeof id === "string" && typeof summary === "string" && summary.trim()) {
      map.set(id, summary.trim());
    }
  };

  try {
    const parsed = JSON.parse(text) as Array<{ id: string; summary: string }>;
    for (const entry of parsed) add(entry?.id, entry?.summary);
    return map;
  } catch {
    // Fallback: vollständige Objekte aus (evtl. abgeschnittenem) JSON extrahieren.
    const objectRegex =
      /\{\s*"id"\s*:\s*"((?:[^"\\]|\\.)*)"\s*,\s*"summary"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
    for (const match of text.matchAll(objectRegex)) {
      try {
        add(JSON.parse(`"${match[1]}"`), JSON.parse(`"${match[2]}"`));
      } catch {
        add(match[1], match[2]);
      }
    }
    return map;
  }
}

export async function summarizeArticles(
  items: SummarizeInput[],
  extraInstructions = "",
): Promise<Map<string, SummaryResult>> {
  const result = new Map<string, SummaryResult>();
  for (const item of items) {
    result.set(item.id, {
      summary: fallbackSummary(item.description, item.title),
      ai: false,
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || items.length === 0) {
    if (!apiKey) {
      console.warn(
        "[summarize] GEMINI_API_KEY fehlt – nutze Fallback-Zusammenfassungen.",
      );
    }
    return result;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const model = genAI.getGenerativeModel({ model: modelName });

    const chunkResults = await Promise.allSettled(
      chunk(items, CHUNK_SIZE).map((group) =>
        summarizeChunk(model, group, extraInstructions),
      ),
    );

    for (const chunkResult of chunkResults) {
      if (chunkResult.status === "fulfilled") {
        for (const [id, summary] of chunkResult.value) {
          const item = items.find((entry) => entry.id === id);
          if (
            item &&
            isAcceptableSummary(summary, item.title, item.description)
          ) {
            result.set(id, { summary, ai: true });
          }
        }
      } else {
        console.warn(
          "[summarize] Gemini-Chunk fehlgeschlagen:",
          chunkResult.reason instanceof Error
            ? chunkResult.reason.message
            : chunkResult.reason,
        );
      }
    }
  } catch (error) {
    console.warn(
      "[summarize] Gemini nicht verfügbar – nutze Fallback:",
      error instanceof Error ? error.message : error,
    );
  }

  return result;
}
