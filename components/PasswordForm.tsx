"use client";

import { useActionState } from "react";
import {
  changePassword,
  type PasswordActionState,
} from "@/app/profil/passwort/actions";

const initialState: PasswordActionState = {};

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          Neues Passwort
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
        />
        <p className="mt-1 text-xs text-muted">Mindestens 8 Zeichen.</p>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          Neues Passwort bestätigen
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
        />
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
        {pending ? "Wird geändert …" : "Passwort ändern"}
      </button>
    </form>
  );
}
