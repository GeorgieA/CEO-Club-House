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
  const resetSuccess = searchParams.get("reset") === "1";
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <>
      {resetSuccess && (
        <p role="status" className="mb-4 text-sm font-semibold text-[#15803d]">
          Passwort geändert. Bitte melde dich an.
        </p>
      )}

      {confirmError && (
        <p role="alert" className="mb-4 text-sm font-semibold text-[#dc2626]">
          E-Mail-Bestätigung fehlgeschlagen. Bitte registriere dich erneut oder
          kontaktiere den Support.
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="identifier"
            className="mb-1 block text-sm font-semibold text-ink"
          >
            E-Mail oder Username
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            autoComplete="username"
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-ink outline-none focus:border-accent dark:bg-[#181230]"
            placeholder="deine@email.de oder username"
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
          <p className="mt-2 text-right text-sm">
            <Link
              href="/passwort-vergessen"
              className="font-semibold text-accent hover:underline"
            >
              Passwort vergessen?
            </Link>
          </p>
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
