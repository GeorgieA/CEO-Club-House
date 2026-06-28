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
          <h2 className="mb-3 text-xl font-bold text-ink">
            Verantwortlicher
          </h2>
          <p className="text-muted">
            Finity In
            <br />
            Astrid-Lindgren-Straße 121
            <br />
            81829 München
            <br />
            Deutschland
            <br />
            <br />
            Telefon: +49 89 90 422 62 90
            <br />
            E-Mail:{" "}
            <a
              href="mailto:info@finity-in.com"
              className="font-semibold text-accent hover:underline"
            >
              info@finity-in.com
            </a>
          </p>
        </section>

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
            Server-Logfiles
          </h2>
          <p className="text-muted">
            Beim Aufruf unserer Seiten werden durch unseren Hosting-Anbieter
            automatisch Informationen erfasst, die dein Browser übermittelt
            (z. B. Browsertyp und -version, verwendetes Betriebssystem,
            Referrer-URL, Uhrzeit der Anfrage und IP-Adresse in gekürzter bzw.
            technisch erforderlicher Form). Diese Daten sind technisch notwendig,
            um die Website auszuliefern und ihre Stabilität und Sicherheit zu
            gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse am sicheren Betrieb).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Newsletter & Konto
          </h2>
          <p className="text-muted">
            Wenn du dich für den Newsletter anmeldest oder ein Konto erstellst,
            speichern wir die dafür nötigen Daten (z. B. E-Mail-Adresse,
            Username) bei unserem Dienstleister Supabase. Die Verarbeitung
            erfolgt auf Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a
            DSGVO) bzw. zur Erfüllung des Nutzungsverhältnisses (Art. 6 Abs. 1
            lit. b DSGVO). Du kannst deine Einwilligung jederzeit mit Wirkung
            für die Zukunft widerrufen und dein Konto löschen lassen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Kommentare & Reaktionen
          </h2>
          <p className="text-muted">
            Wenn du Artikel kommentierst, likest oder meldest, speichern wir den
            Inhalt deines Beitrags, deinen Username sowie Zeitpunkt und Bezug zum
            jeweiligen Artikel. Kommentare sind öffentlich sichtbar. Zur
            Moderation und Missbrauchsvermeidung werten wir Meldungen aus und
            blenden Beiträge ab einer bestimmten Anzahl von Meldungen automatisch
            aus. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b und lit. f DSGVO.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Auftragsverarbeiter & Dienstleister
          </h2>
          <p className="text-muted">
            Für Betrieb und Hosting setzen wir sorgfältig ausgewählte
            Dienstleister ein, mit denen – soweit erforderlich – Verträge zur
            Auftragsverarbeitung nach Art. 28 DSGVO bestehen:
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-muted">
            <li>
              <strong>Vercel Inc.</strong> – Hosting und Auslieferung der
              Website.
            </li>
            <li>
              <strong>Supabase</strong> – Datenbank, Authentifizierung und
              Speicherung von Konto-, Newsletter- und Kommentardaten.
            </li>
            <li>
              <strong>Google (Gemini API)</strong> – KI-gestützte Erstellung von
              Artikel-Zusammenfassungen. Hierbei werden keine personenbezogenen
              Nutzerdaten übermittelt, sondern ausschließlich öffentlich
              verfügbare Artikelinhalte.
            </li>
          </ul>
          <p className="mt-3 text-muted">
            Soweit Daten in Drittländer (z. B. USA) übermittelt werden, erfolgt
            dies auf Basis geeigneter Garantien wie EU-Standardvertragsklauseln.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Speicherdauer</h2>
          <p className="text-muted">
            Wir speichern personenbezogene Daten nur so lange, wie es für die
            jeweiligen Zwecke erforderlich ist oder gesetzliche
            Aufbewahrungspflichten bestehen. Konto- und Kommentardaten werden bis
            zur Löschung deines Kontos gespeichert. Newsletter-Daten verarbeiten
            wir bis zum Widerruf deiner Einwilligung.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Deine Rechte</h2>
          <p className="mb-3 text-muted">
            Dir stehen nach der DSGVO folgende Rechte zu:
          </p>
          <ul className="list-disc space-y-1 pl-5 text-muted">
            <li>Auskunft über die zu dir gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung deiner Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>
              Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft
            </li>
          </ul>
          <p className="mt-3 text-muted">
            Zur Ausübung deiner Rechte genügt eine Nachricht an{" "}
            <a
              href="mailto:info@finity-in.com"
              className="font-semibold text-accent hover:underline"
            >
              info@finity-in.com
            </a>
            . Außerdem hast du das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), etwa
            beim Bayerischen Landesamt für Datenschutzaufsicht (BayLDA).
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
          Stand: Juni 2026. Bei Fragen zum Datenschutz kontaktiere uns bitte
          unter{" "}
          <a
            href="mailto:info@finity-in.com"
            className="font-semibold text-accent hover:underline"
          >
            info@finity-in.com
          </a>
          .
        </p>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
