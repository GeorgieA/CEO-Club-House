"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { signIn, type AuthActionState } from "@/app/auth/actions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const initialState: AuthActionState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const confirmError = searchParams.get("error") === "confirmation_failed";
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <>
      {confirmError && (
        <p role="alert" className="mb-4 text-sm font-semibold text-[#dc2626]">
          E-Mail-Bestätigung fehlgeschlagen. Bitte registriere dich erneut oder
          kontaktiere den Support.
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
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
            autoComplete="current-password"
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
          />
        </div>

        {state.error && (
          <p role="alert" className="text-sm font-semibold text-[#dc2626]">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-[10px] bg-ink px-4 py-3 font-bold text-accent transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "Wird angemeldet …" : "Anmelden"}
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Anmelden</h1>
        <p className="mb-8 text-muted">
          Melde dich an, um Artikel zu liken und zu kommentieren.
        </p>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-sm text-muted">
          Noch kein Konto?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Registrieren
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
