// Cattura UTM, click ID e contesto landing per attribuzione ADV.
// Persiste in sessionStorage con scadenza configurabile.

const STORAGE_KEY = "attribution_v1";
const TTL_DAYS = 90;

const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "ttclid", "msclkid", "li_fat_id", "twclid"] as const;
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id"] as const;

export type AttributionData = {
  // Click IDs
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  li_fat_id?: string;
  twclid?: string;
  // UTM
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  // Landing context
  landing_page?: string;
  landing_referrer?: string;
  first_seen_at?: string;
  expires_at?: string;
};

export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const existing = getAttribution();

    // Se esiste e non scaduta, aggiorna solo se ci sono NUOVI click id/utm in URL
    const incoming: AttributionData = {};
    let hasNew = false;
    [...CLICK_IDS, ...UTM_PARAMS].forEach((key) => {
      const v = params.get(key);
      if (v) {
        (incoming as Record<string, string>)[key] = v;
        hasNew = true;
      }
    });

    if (!existing) {
      // First touch
      const data: AttributionData = {
        ...incoming,
        landing_page: url.pathname + url.search,
        landing_referrer: document.referrer || undefined,
        first_seen_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + TTL_DAYS * 86400_000).toISOString(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else if (hasNew) {
      // Last touch override su nuovi click id
      const merged: AttributionData = {
        ...existing,
        ...incoming,
        expires_at: new Date(Date.now() + TTL_DAYS * 86400_000).toISOString(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    /* noop */
  }
};

export const getAttribution = (): AttributionData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionData;
    if (parsed.expires_at && new Date(parsed.expires_at).getTime() < Date.now()) {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const getPageContext = () => {
  if (typeof window === "undefined") return {};
  return {
    page_location: window.location.href,
    page_path: window.location.pathname + window.location.hash,
    page_title: document.title,
    page_referrer: document.referrer || undefined,
  };
};
