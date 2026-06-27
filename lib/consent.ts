export type ConsentState = {
  necessary: true;
  analytics: boolean;
  timestamp: string;
  version: number;
};

const STORAGE_KEY = "cookie-consent";
const COOKIE_KEY = "cookie-consent";
const CONSENT_VERSION = 1;
const ONE_YEAR = 60 * 60 * 24 * 365;

export const CONSENT_CHANGE_EVENT = "cookie-consent-change";
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    document.cookie = `${COOKIE_KEY}=${
      analytics ? "all" : "necessary"
    }; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, { detail: state }),
    );
  } catch {
    // localStorage/cookies nicht verfügbar — Banner erscheint erneut
  }

  return state;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics ?? false;
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}
