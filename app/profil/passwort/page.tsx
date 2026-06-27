import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PasswordForm from "@/components/PasswordForm";
import ScrollToTop from "@/components/ScrollToTop";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Passwort ändern | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PasswortPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <Link
          href="/profil"
          className="mb-6 inline-block text-sm font-semibold text-accent hover:underline"
        >
          ← Zurück zum Profil
        </Link>
        <h1 className="mb-2 text-2xl font-extrabold text-ink">
          Passwort ändern
        </h1>
        <p className="mb-8 text-muted">
          Vergib ein neues Passwort für dein Konto.
        </p>
        <PasswordForm />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
