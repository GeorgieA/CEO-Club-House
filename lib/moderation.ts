import type { GenerationConfig } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BLOCKED_WORDS, LINK_PATTERNS } from "@/lib/moderation-words";

// Das alte SDK kennt thinkingConfig nicht in den Typen, reicht es aber durch.
type GenerationConfigWithThinking = GenerationConfig & {
  thinkingConfig?: { thinkingBudget: number };
};

export type ModerationResult =
  | { allowed: true }
  | { allowed: false; reason: string };

function normalizeForCheck(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsBlockedWords(text: string): boolean {
  const normalized = normalizeForCheck(text);
  return BLOCKED_WORDS.some((word) => {
    const w = normalizeForCheck(word);
    return normalized.includes(w);
  });
}

function containsLinks(text: string): boolean {
  return LINK_PATTERNS.some((pattern) => pattern.test(text));
}

async function moderateWithGemini(text: string): Promise<ModerationResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[moderation] GEMINI_API_KEY fehlt — nur Regeln aktiv.");
    return { allowed: true };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Du bist Moderator für eine deutschsprachige Business-News-Community.
Prüfe den folgenden Kommentar auf verbotene Inhalte:
- Hassrede, Diskriminierung, Beleidigungen
- Belästigung, Drohungen
- Sexuelle oder explizite Inhalte
- Gewalt, illegale Handlungen, Anleitungen zu Straftaten
- Selbstverletzung oder Suizid-Aufforderungen
- Spam oder Werbung

Antworte NUR mit gültigem JSON: {"allowed": true} oder {"allowed": false, "reason": "kurzer Grund auf Deutsch"}

Kommentar:
"""
${text.slice(0, 2000)}
"""`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0,
        // Antwort ist winzig ({"allowed":...}); kein Spielraum für Verschwendung.
        maxOutputTokens: 120,
        thinkingConfig: { thinkingBudget: 0 },
      } as GenerationConfigWithThinking,
    });

    const parsed = JSON.parse(result.response.text()) as {
      allowed: boolean;
      reason?: string;
    };

    if (parsed.allowed === false) {
      return {
        allowed: false,
        reason: parsed.reason ?? "Inhalt nicht erlaubt.",
      };
    }

    return { allowed: true };
  } catch (error) {
    console.warn(
      "[moderation] Gemini nicht verfügbar — nur Regeln aktiv:",
      error instanceof Error ? error.message : error,
    );
    return { allowed: true };
  }
}

export async function moderateComment(text: string): Promise<ModerationResult> {
  if (containsLinks(text)) {
    return { allowed: false, reason: "Links sind in Kommentaren nicht erlaubt." };
  }

  if (containsBlockedWords(text)) {
    return {
      allowed: false,
      reason: "Dieser Inhalt verstößt gegen unsere Community-Richtlinien.",
    };
  }

  return moderateWithGemini(text);
}
