"use client";

import { useActionState } from "react";
import {
  updateGeminiInstructions,
  type AdminActionState,
} from "@/app/admin/actions";
import { MAX_GEMINI_INSTRUCTIONS } from "@/lib/settings";

const initialState: AdminActionState = {};

interface AdminSettingsFormProps {
  instructions: string;
  seedLikesEnabled: boolean;
}

export default function AdminSettingsForm({
  instructions,
  seedLikesEnabled,
}: AdminSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    updateGeminiInstructions,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="geminiInstructions"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          Globale Prompt-Anweisungen für Gemini
        </label>
        <p className="mb-3 text-sm text-muted">
          Diese Anweisungen werden bei jeder automatischen News-Erstellung an
          Gemini übergeben – zusätzlich zum Standard-Prompt. Nutze sie z. B. für
          Tonalität, Schwerpunkte oder Dinge, die vermieden werden sollen.
        </p>
        <textarea
          id="geminiInstructions"
          name="geminiInstructions"
          rows={10}
          maxLength={MAX_GEMINI_INSTRUCTIONS}
          defaultValue={instructions}
          placeholder="z. B. Schreibe betont sachlich. Hebe konkrete Zahlen und Auswirkungen für Unternehmer hervor. Vermeide Spekulationen."
          className="w-full resize-y rounded-[10px] border border-line bg-white px-4 py-3 font-mono text-sm text-ink outline-none focus:border-accent dark:bg-[#181230]"
        />
        <p className="mt-1 text-xs text-muted">
          Max. {MAX_GEMINI_INSTRUCTIONS.toLocaleString("de-DE")} Zeichen. Leer
          lassen, um nur den Standard-Prompt zu verwenden.
        </p>
      </div>

      <div className="rounded-[14px] border border-line bg-white p-5 dark:bg-[#181230]">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="seedLikesEnabled"
            defaultChecked={seedLikesEnabled}
            className="mt-1 h-4 w-4 accent-accent"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              Seed-Likes aktiv
            </span>
            <span className="mt-1 block text-sm text-muted">
              Artikel erhalten automatisch künstliche Likes (max. 350), bis
              echter Traffic da ist. Wächst stündlich mit dem Alter des
              Artikels. Schaltet sich ab, wenn genug echte Nutzer voten.
            </span>
          </span>
        </label>
      </div>

      {state.error && (
        <p role="alert" className="text-sm font-semibold text-[#dc2626]">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm font-semibold text-[#15803d]">
          {state.success}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-ink px-4 py-3 font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Wird gespeichert …" : "Einstellungen speichern"}
      </button>
    </form>
  );
}
