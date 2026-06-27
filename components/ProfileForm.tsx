"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "@/app/profil/actions";
import { CATEGORIES } from "@/lib/categories";
import type { Profile } from "@/lib/validation";

const initialState: ProfileActionState = {};

interface ProfileFormProps {
  profile: Profile;
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-6">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-semibold text-ink">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          defaultValue={profile.username}
          pattern="[a-z0-9_]{3,20}"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
        />
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
            const checked = profile.preferred_categories.includes(category.slug);
            return (
              <label
                key={category.slug}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  checked
                    ? "border-ink bg-ink text-accent"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                <input
                  type="checkbox"
                  name="preferredCategories"
                  value={category.slug}
                  defaultChecked={checked}
                  className="sr-only"
                />
                {category.label}
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          Auf der Startseite werden diese Kategorien standardmäßig vorausgewählt.
        </p>
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
