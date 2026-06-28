"use client";

import { useActionState, useState } from "react";
import { updateProfile, type ProfileActionState } from "@/app/profil/actions";
import { CATEGORIES } from "@/lib/categories";
import type { Profile } from "@/lib/validation";

const initialState: ProfileActionState = {};

interface ProfileFormProps {
  profile: Profile;
  subscribed: boolean;
}

export default function ProfileForm({ profile, subscribed }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    profile.preferred_categories,
  );

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug],
    );
  };

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      <div>
        <p className="text-lg font-bold text-ink">Hallo @{profile.username}</p>
        <p className="mt-1 text-xs text-muted">
          Dein Username kann aktuell nicht geändert werden.
        </p>
        <input type="hidden" name="username" value={profile.username} />
      </div>

      <div>
        <label htmlFor="businessUrl" className="mb-1 block text-sm font-semibold text-ink">
          My Business URL
        </label>
        <input
          id="businessUrl"
          name="businessUrl"
          type="url"
          defaultValue={profile.business_url ?? ""}
          placeholder="https://mein-unternehmen.de"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
        />
        <p className="mt-1 text-xs text-muted">
          Wird öffentlich als Text angezeigt (nicht klickbar). Keine Links in
          Kommentaren erlaubt.
        </p>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">
          Bevorzugte News-Kategorien
        </legend>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((category) => {
            const checked = selectedCategories.includes(category.slug);
            return (
              <button
                key={category.slug}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleCategory(category.slug)}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  checked
                    ? "border-ink bg-ink text-accent"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
        {selectedCategories.map((slug) => (
          <input
            key={slug}
            type="hidden"
            name="preferredCategories"
            value={slug}
          />
        ))}
        <p className="mt-2 text-xs text-muted">
          Mehrfachauswahl möglich. Auf der Startseite werden diese Kategorien
          standardmäßig vorausgewählt.
        </p>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-ink">
          Newsletter
        </legend>
        <label
          htmlFor="newsletter"
          className="flex items-start gap-2.5 text-sm text-muted"
        >
          <input
            id="newsletter"
            name="newsletter"
            type="checkbox"
            value="on"
            defaultChecked={subscribed}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
          />
          <span>
            Ich möchte das CEO-Clubhouse-Briefing per E-Mail erhalten.
          </span>
        </label>
      </fieldset>

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
        {pending ? "Wird gespeichert …" : "Profil speichern"}
      </button>
    </form>
  );
}
