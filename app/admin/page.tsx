import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSettingsForm from "@/components/AdminSettingsForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { isCurrentUserAdmin } from "@/lib/admin";
import { getGeminiInstructions } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Admin | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/");

  const instructions = await getGeminiInstructions();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Admin</h1>
        <p className="mb-8 text-muted">
          Globale Einstellungen für die automatische News-Erstellung.
        </p>
        <AdminSettingsForm instructions={instructions} />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
