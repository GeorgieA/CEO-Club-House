"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getConsent,
  OPEN_SETTINGS_EVENT,
  saveConsent,
} from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (!getConsent()) {
      setVisible(true);
    }

    const openSettings = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? false);
      setShowDetails(true);
      setVisible(true);
    };

    window.addEventListener(OPEN_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, openSettings);
  }, []);

  if (!visible) return null;

  const acceptAll = () => {
    saveConsent(true);
    setVisible(false);
  };

  const acceptNecessary = () => {
    saveConsent(false);
    setVisible(false);
  };

  const saveSelection = () => {
    saveConsent(analytics);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-0 bottom-0 z-[200] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-[640px] rounded-2xl border border-line bg-white p-6 shadow-[0_20px_60px_-15px_rgba(25,0,70,0.35)] dark:bg-[#181230]">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-[3px] w-[18px] rounded-sm bg-accent" />
          <p className="text-[0.8rem] font-bold tracking-[0.12em] text-accent uppercase">
            Datenschutz
          </p>
        </div>

        <h2 className="mb-2 text-lg font-extrabold text-ink">
          Wir respektieren deine Privatsphäre
        </h2>
        <p className="mb-5 text-sm leading-relaxed text-muted">
          Wir verwenden notwendige Cookies, damit die Seite funktioniert (z. B.
          dein Login). Optionale Cookies helfen uns, das Angebot zu verbessern —
          nur mit deiner Einwilligung. Mehr in unserer{" "}
          <Link
            href="/datenschutz"
            className="font-semibold text-accent hover:underline"
          >
            Datenschutzerklärung
          </Link>
          .
        </p>

        {showDetails && (
          <div className="mb-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4 rounded-xl border border-line bg-[#fafbfc] p-4 dark:bg-[#0f0a24]">
              <div>
                <p className="text-sm font-bold text-ink">
                  Notwendig
                </p>
                <p className="text-xs text-muted">
                  Erforderlich für Login, Sicherheit und Grundfunktionen. Immer
                  aktiv.
                </p>
              </div>
              <span className="mt-0.5 shrink-0 rounded-full bg-business-bg px-3 py-1 text-xs font-bold text-business-fg">
                Aktiv
              </span>
            </div>

            <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-[#fafbfc] p-4 dark:bg-[#0f0a24]">
              <div>
                <p className="text-sm font-bold text-ink">Statistik</p>
                <p className="text-xs text-muted">
                  Anonyme Nutzungsstatistik, um die Seite zu verbessern.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-accent"
              />
            </label>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={acceptAll}
            className="order-1 rounded-[10px] bg-ink px-5 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-90 sm:flex-1"
          >
            Alle akzeptieren
          </button>
          <button
            type="button"
            onClick={acceptNecessary}
            className="order-2 rounded-[10px] border-[1.5px] border-ink bg-white px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-[#f1f5f9] dark:bg-transparent sm:flex-1"
          >
            Nur notwendige
          </button>
          {showDetails ? (
            <button
              type="button"
              onClick={saveSelection}
              className="order-3 rounded-[10px] border border-line px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink sm:flex-1"
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="order-3 rounded-[10px] border border-line px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-ink sm:flex-1"
            >
              Einstellungen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
