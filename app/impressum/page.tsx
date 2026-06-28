import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Impressum | CEO Clubhouse",
  description: "Anbieterkennzeichnung und Kontaktinformationen von CEO Clubhouse.",
  robots: { index: true, follow: true },
};

export default function ImpressumPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Impressum
        </h1>
        <p className="mb-10 text-muted">
          Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG).
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Anbieter</h2>
          <p className="text-muted">
            Finity In
            <br />
            Astrid-Lindgren-Straße 121
            <br />
            81829 München
            <br />
            Deutschland
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Kontakt</h2>
          <p className="text-muted">
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
          <h2 className="mb-3 text-xl font-bold text-ink">
            Redaktionell verantwortlich
          </h2>
          <p className="text-muted">
            Finity In
            <br />
            Astrid-Lindgren-Straße 121
            <br />
            81829 München
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            EU-Streitschlichtung
          </h2>
          <p className="text-muted">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse findest du oben.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            Verbraucherstreitbeilegung
          </h2>
          <p className="text-muted">
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Haftung für Inhalte</h2>
          <p className="text-muted">
            Als Diensteanbieter sind wir gemäß den allgemeinen Gesetzen für
            eigene Inhalte auf diesen Seiten verantwortlich. Wir sind jedoch
            nicht verpflichtet, übermittelte oder gespeicherte fremde
            Informationen zu überwachen oder nach Umständen zu forschen, die auf
            eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">Haftung für Links</h2>
          <p className="text-muted">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
            Seiten verantwortlich.
          </p>
        </section>

      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
