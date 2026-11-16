// Gestione Consent Mode v2 + categorie cookie
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: string;
  version: number;
};

const STORAGE_KEY = "cookie_consent_v1";
const CONSENT_VERSION = 1;

export const getStoredConsent = (): ConsentState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const saveConsent = (analytics: boolean, marketing: boolean, preferences: boolean) => {
  const state: ConsentState = {
    necessary: true,
    analytics,
    marketing,
    preferences,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  applyConsent(state);
  return state;
};

export const applyConsent = (state: ConsentState) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args as unknown as Record<string, unknown>));
  gtag("consent", "update", {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
    functionality_storage: state.preferences ? "granted" : "denied",
    personalization_storage: state.preferences ? "granted" : "denied",
    security_storage: "granted",
  });
  window.dataLayer.push({
    event: "cookie_consent_update",
    consent_analytics: state.analytics,
    consent_marketing: state.marketing,
    consent_preferences: state.preferences,
  });
};

export const acceptAll = () => saveConsent(true, true, true);
export const rejectAll = () => saveConsent(false, false, false);

export const openConsentSettings = () => {
  window.dispatchEvent(new CustomEvent("open-cookie-settings"));
};

export const hasMarketingConsent = (): boolean => {
  const s = getStoredConsent();
  return !!s?.marketing;
};

export const hasAnalyticsConsent = (): boolean => {
  const s = getStoredConsent();
  return !!s?.analytics;
};
