import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "AGB | CEO Clubhouse",
  description:
    "Allgemeine Geschäftsbedingungen für die Nutzung von CEO Clubhouse, Konten und Newsletter.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/agb" },
};

export default function AgbPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[760px] px-6 py-14">
        <h1 className="mb-2 text-3xl font-extrabold tracking-[-0.02em] text-ink">
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="mb-10 text-muted">
          Diese Bedingungen regeln die Nutzung von CEO Clubhouse, die Erstellung
          eines Nutzerkontos sowie das Abonnement des Newsletters.
        </p>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">1. Geltungsbereich</h2>
          <p className="text-muted">
            Diese AGB gelten für die Nutzung der Website CEO Clubhouse sowie aller
            darüber angebotenen Funktionen wie Nutzerkonten, Kommentare,
            Reaktionen und den Newsletter. Mit der Registrierung oder der Anmeldung
            zum Newsletter erklärst du dich mit diesen Bedingungen einverstanden.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">2. Anbieter</h2>
          <p className="text-muted">
            Anbieter des Dienstes ist Finity In, Astrid-Lindgren-Straße 121,
            81829 München, Deutschland. Die vollständigen Kontaktdaten findest du
            im{" "}
            <a
              href="/impressum"
              className="font-semibold text-accent hover:underline"
            >
              Impressum
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">3. Leistungen</h2>
          <p className="text-muted">
            CEO Clubhouse stellt redaktionell aufbereitete Nachrichten und
            Zusammenfassungen aus den Bereichen Tech, KI, Business und Trends
            bereit. Zusammenfassungen werden teilweise KI-gestützt erzeugt. Die
            Inhalte dienen der allgemeinen Information und stellen keine Rechts-,
            Steuer- oder Anlageberatung dar. Ein Anspruch auf ständige
            Verfügbarkeit des Dienstes besteht nicht.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            4. Registrierung & Vertragsschluss
          </h2>
          <p className="text-muted">
            Die Nutzung der Basisinhalte ist kostenlos. Mit dem Absenden des
            Registrierungs- bzw. Newsletter-Formulars gibst du ein Angebot zur
            Nutzung der jeweiligen Funktion ab; der Vertrag kommt mit der
            Bestätigung durch uns bzw. der Aktivierung deines Kontos zustande.
            Ein kostenpflichtiges Angebot besteht derzeit nicht; etwaige künftige
            kostenpflichtige Leistungen werden vorab klar als solche
            gekennzeichnet.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            5. Nutzerkonto & Pflichten
          </h2>
          <p className="text-muted">
            Für bestimmte Funktionen ist ein Konto erforderlich. Du bist
            verpflichtet, korrekte Angaben zu machen und deine Zugangsdaten
            vertraulich zu behandeln. Beiträge und Kommentare dürfen keine
            rechtswidrigen, beleidigenden oder werblichen Inhalte enthalten. Wir
            behalten uns vor, Beiträge zu moderieren, auszublenden oder Konten
            bei Verstößen zu sperren.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            6. Nutzergenerierte Inhalte
          </h2>
          <p className="text-muted">
            Für von dir veröffentlichte Inhalte (z. B. Kommentare) bleibst du
            verantwortlich. Du versicherst, über die nötigen Rechte zu verfügen,
            und räumst uns das einfache, zeitlich und räumlich unbeschränkte
            Recht ein, diese Inhalte im Rahmen des Dienstes darzustellen. Du
            kannst eigene Beiträge jederzeit löschen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">7. Newsletter</h2>
          <p className="text-muted">
            Mit der Anmeldung zum Newsletter willigst du in den Empfang
            regelmäßiger E-Mails ein. Du kannst dieses Abonnement jederzeit über
            den Abmeldelink in jeder E-Mail oder durch eine Nachricht an uns
            widerrufen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            8. Widerrufsrecht
          </h2>
          <p className="text-muted">
            Da es sich um kostenlose, digitale Leistungen handelt, entstehen dir
            keine Kosten. Du kannst dein Konto sowie Einwilligungen (z. B. zum
            Newsletter) jederzeit ohne Angabe von Gründen mit Wirkung für die
            Zukunft widerrufen bzw. beenden. Ein gesetzliches Widerrufsrecht für
            entgeltliche Verträge bleibt hiervon unberührt, sobald solche
            Leistungen angeboten werden.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            9. Verfügbarkeit
          </h2>
          <p className="text-muted">
            Wir bemühen uns um einen möglichst störungsfreien Betrieb, können
            jedoch keine ununterbrochene Verfügbarkeit zusichern. Wartungen,
            technische Störungen oder höhere Gewalt können zu vorübergehenden
            Einschränkungen führen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            10. Urheberrecht & Inhalte Dritter
          </h2>
          <p className="text-muted">
            Verlinkte Original-Artikel verbleiben im Eigentum der jeweiligen
            Quelle. Zusammenfassungen werden mit größtmöglicher Sorgfalt erstellt;
            für die Richtigkeit und Vollständigkeit der Inhalte sowie verlinkter
            externer Seiten übernehmen wir keine Gewähr.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">11. Haftung</h2>
          <p className="text-muted">
            Wir haften unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie
            nach den Vorgaben des Produkthaftungsgesetzes. Bei leichter
            Fahrlässigkeit haften wir nur bei Verletzung wesentlicher
            Vertragspflichten und begrenzt auf den vorhersehbaren, typischen
            Schaden.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            12. Datenschutz
          </h2>
          <p className="text-muted">
            Informationen zur Verarbeitung deiner personenbezogenen Daten findest
            du in unserer{" "}
            <a
              href="/datenschutz"
              className="font-semibold text-accent hover:underline"
            >
              Datenschutzerklärung
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            13. Online-Streitbeilegung
          </h2>
          <p className="text-muted">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Wir sind nicht verpflichtet und nicht bereit, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-ink">
            14. Änderungen & Schlussbestimmungen
          </h2>
          <p className="text-muted">
            Wir behalten uns vor, diese AGB anzupassen, soweit dies zur Anpassung
            an geänderte Rechtslagen oder Funktionen erforderlich ist. Es gilt das
            Recht der Bundesrepublik Deutschland. Sollten einzelne Bestimmungen
            unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen
            unberührt.
          </p>
        </section>

        <p className="text-sm text-muted">
          Stand: Juni 2026. Bei Fragen zu diesen Bedingungen kontaktiere uns
          bitte unter{" "}
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
