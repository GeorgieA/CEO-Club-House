import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSettingsForm from "@/components/AdminSettingsForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { getUserStats, isCurrentUserAdmin } from "@/lib/admin";
import { getGeminiInstructions } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Admin | CEO Clubhouse",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) redirect("/");

  const [instructions, stats] = await Promise.all([
    getGeminiInstructions(),
    getUserStats(),
  ]);

  const statCards = [
    { label: "Registrierte Nutzer", value: stats.total },
    { label: "Neu (7 Tage)", value: stats.last7Days },
    { label: "Neu (30 Tage)", value: stats.last30Days },
    { label: "Admins", value: stats.admins },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-2xl font-extrabold text-ink">Admin</h1>
        <p className="mb-8 text-muted">
          Übersicht und globale Einstellungen für CEO Clubhouse.
        </p>

        <section className="mb-12">
          <h2 className="mb-4 text-sm font-bold tracking-[0.12em] text-accent uppercase">
            Nutzer
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[14px] border border-line bg-white p-5 dark:bg-[#181230]"
              >
                <p className="text-3xl font-extrabold text-ink">{card.value}</p>
                <p className="mt-1 text-sm text-muted">{card.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-bold tracking-[0.12em] text-accent uppercase">
            News-Automatik
          </h2>
          <AdminSettingsForm instructions={instructions} />
        </section>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
