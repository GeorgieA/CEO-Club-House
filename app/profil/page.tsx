import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileForm from "@/components/ProfileForm";
import ScrollToTop from "@/components/ScrollToTop";
import { isCurrentUserAdmin } from "@/lib/admin";
import { isSubscribed } from "@/lib/newsletter";
import { createClient, getUser } from "@/lib/supabase/server";
import type { Profile } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Mein Profil | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export default async function ProfilPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = await isCurrentUserAdmin();
  const subscribed = user.email ? await isSubscribed(user.email) : false;

  if (error || !profile) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-lg px-6 py-14">
          <p className="text-muted">
            Profil konnte nicht geladen werden. Bitte versuche es später erneut.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Mein Profil</h1>
        <p className="mb-8 text-muted">
          Verwalte deinen Username, deine Business-URL und deine
          News-Präferenzen.
        </p>
        <ProfileForm profile={profile as Profile} subscribed={subscribed} />

        <div className="mt-10 border-t border-line pt-8">
          <h2 className="mb-2 text-lg font-bold text-ink">Konto-Sicherheit</h2>
          <p className="mb-4 text-sm text-muted">
            Ändere das Passwort für dein Konto.
          </p>
          <Link
            href="/profil/passwort"
            className="inline-block rounded-[10px] border-[1.5px] border-ink px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-accent"
          >
            Passwort ändern
          </Link>
        </div>

        {isAdmin && (
          <div className="mt-10 border-t border-line pt-8">
            <h2 className="mb-2 text-lg font-bold text-ink">Administration</h2>
            <p className="mb-4 text-sm text-muted">
              Globale Prompt-Anweisungen für die automatische News-Erstellung
              verwalten.
            </p>
            <Link
              href="/admin"
              className="inline-block rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-90"
            >
              Zum Admin-Bereich
            </Link>
          </div>
        )}

        <div className="mt-10 border-t border-line pt-8">
          <h2 className="mb-2 text-lg font-bold text-ink">Abmelden</h2>
          <p className="mb-4 text-sm text-muted">
            Du wirst von diesem Gerät abgemeldet.
          </p>
          <form action={signOut}>
            <button
              type="submit"
              className="inline-block rounded-[10px] border-[1.5px] border-ink px-5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-accent"
            >
              Abmelden
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
