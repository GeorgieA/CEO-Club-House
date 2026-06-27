import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import CookieSettingsLink from "@/components/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | CEO Clubhouse",
  description:
    "Informationen zum Datenschutz und zur Verwendung von Cookies bei CEO Clubhouse.",
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Datenschutzerklärung
        </h1>
        <p className="mb-10 text-muted">
          Wir behandeln deine Daten vertraulich und gemäß DSGVO. Hier erfährst
          du, welche Cookies wir einsetzen und warum.
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Cookies & Speicher</h2>
          <p className="mb-4 text-muted">
            Wir verwenden nur das technisch Nötige sowie optionale Funktionen,
            die du selbst aktivierst. Es findet kein Verkauf deiner Daten und
            kein Cross-Site-Tracking statt.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="py-3 pr-4 font-bold text-ink">Name</th>
                  <th className="py-3 pr-4 font-bold text-ink">Zweck</th>
                  <th className="py-3 pr-4 font-bold text-ink">Kategorie</th>
                  <th className="py-3 font-bold text-ink">Dauer</th>
                </tr>
              </thead>
              <tbody className="text-muted">
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 font-mono text-xs">sb-…-auth-token</td>
                  <td className="py-3 pr-4">
                    Hält dich nach dem Login angemeldet (Supabase Auth).
                  </td>
                  <td className="py-3 pr-4">Notwendig</td>
                  <td className="py-3">bis zu 1 Jahr</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 font-mono text-xs">cookie-consent</td>
                  <td className="py-3 pr-4">
                    Speichert deine Cookie-Entscheidung.
                  </td>
                  <td className="py-3 pr-4">Notwendig</td>
                  <td className="py-3">1 Jahr</td>
                </tr>
                <tr className="border-b border-line">
                  <td className="py-3 pr-4 font-mono text-xs">theme</td>
                  <td className="py-3 pr-4">
                    Merkt sich Hell-/Dunkelmodus (lokal im Browser).
                  </td>
                  <td className="py-3 pr-4">Notwendig</td>
                  <td className="py-3">dauerhaft (localStorage)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Notwendige Cookies
          </h2>
          <p className="text-muted">
            Diese Cookies sind für den Betrieb der Seite erforderlich – etwa um
            dich angemeldet zu halten und deine Datenschutz-Einstellung zu
            speichern. Sie lassen sich nicht deaktivieren, da die Seite sonst
            nicht korrekt funktioniert. Eine Einwilligung ist hierfür nicht
            erforderlich.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Optionale Cookies (Statistik)
          </h2>
          <p className="text-muted">
            Optionale Cookies setzen wir nur mit deiner ausdrücklichen
            Einwilligung. Aktuell sind keine Statistik- oder Marketing-Dienste
            aktiv. Sollten wir künftig anonyme Nutzungsstatistiken einsetzen,
            geschieht dies ausschließlich nach deiner Zustimmung über den
            Cookie-Banner.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Newsletter & Konto
          </h2>
          <p className="text-muted">
            Wenn du dich für den Newsletter anmeldest oder ein Konto erstellst,
            speichern wir die dafür nötigen Daten (z. B. E-Mail-Adresse,
            Username) bei unserem Dienstleister Supabase. Du kannst dein Konto
            jederzeit löschen lassen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Deine Einstellungen
          </h2>
          <p className="mb-4 text-muted">
            Du kannst deine Cookie-Entscheidung jederzeit ändern.
          </p>
          <CookieSettingsLink className="rounded-[10px] border-[1.5px] border-ink bg-ink px-5 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-90" />
        </section>

        <p className="text-sm text-muted">
          Stand: Juni 2026. Bei Fragen zum Datenschutz kontaktiere uns bitte.
        </p>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
