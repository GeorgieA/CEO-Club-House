"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthActionState } from "@/app/auth/actions";
import ConsentCheckbox from "@/components/ConsentCheckbox";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const initialState: AuthActionState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Registrieren</h1>
        <p className="mb-8 text-muted">
          Erstelle dein Konto. Du musst deine E-Mail bestätigen, bevor du dich
          anmelden kannst.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-semibold text-ink">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              pattern="[A-Za-z0-9_]{3,20}"
              className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
              placeholder="Username"
            />
            <p className="mt-1 text-xs text-muted">
              3–20 Zeichen, Buchstaben, Zahlen, Unterstrich
            </p>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-ink">
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

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-semibold text-ink">
              Passwort
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
          </div>

          <label
            htmlFor="newsletter"
            className="flex items-start gap-2.5 text-sm text-muted"
          >
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              value="on"
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
            />
            <span>
              Ja, ich möchte das kostenlose CEO-Clubhouse-Briefing per E-Mail
              erhalten. (optional)
            </span>
          </label>

          <ConsentCheckbox />

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
            {pending ? "Wird registriert …" : "Konto erstellen"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted">
          Bereits registriert?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Anmelden
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
