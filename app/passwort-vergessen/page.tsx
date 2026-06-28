import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Passwort vergessen | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export default function PasswortVergessenPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">
          Passwort vergessen
        </h1>
        <p className="mb-8 text-muted">
          Gib deine E-Mail-Adresse ein. Wir senden dir einen Link zum
          Zurücksetzen deines Passworts.
        </p>

        <ForgotPasswordForm />

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
