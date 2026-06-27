import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProfileForm from "@/components/ProfileForm";
import ScrollToTop from "@/components/ScrollToTop";
import { createClient, getUser } from "@/lib/supabase/server";
import type { Profile } from "@/lib/validation";

export default async function ProfilPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

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
        <ProfileForm profile={profile as Profile} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
