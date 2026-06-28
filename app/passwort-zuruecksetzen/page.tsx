import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Passwort zurücksetzen | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PasswortZuruecksetzenPage() {
  const user = await getUser();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">
          Neues Passwort vergeben
        </h1>

        {!user ? (
          <>
            <p className="mb-6 text-muted">
              Der Link ist ungültig oder abgelaufen. Bitte fordere einen neuen
              Link an.
            </p>
            <Link
              href="/passwort-vergessen"
              className="inline-block rounded-[10px] bg-ink px-4 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-90"
            >
              Neuen Link anfordern
            </Link>
          </>
        ) : (
          <>
            <p className="mb-8 text-muted">
              Wähle ein neues Passwort für dein Konto.
            </p>
            <ResetPasswordForm />
          </>
        )}

        <p className="mt-6 text-sm text-muted">
          <Link href="/login" className="font-semibold text-accent hover:underline">
            ← Zurück zur Anmeldung
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
