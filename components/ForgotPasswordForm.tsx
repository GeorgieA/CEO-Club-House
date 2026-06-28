"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type ForgotPasswordActionState,
} from "@/app/passwort-vergessen/actions";

const initialState: ForgotPasswordActionState = {};

export default function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-semibold text-ink"
        >
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
          placeholder="deine@email.de"
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
        className="rounded-[10px] bg-ink px-4 py-3 font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Wird gesendet …" : "Link senden"}
      </button>
    </form>
  );
}
