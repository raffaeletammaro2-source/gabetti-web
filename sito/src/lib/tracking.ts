// Tracciamento: il sito scrive solo nel dataLayer, GTM traduce per GA4, Meta e Google Ads.
// Regole (vedi docs/tracciamento/README.md):
// - gli eventi di conversione partono solo dopo che il server ha confermato l'invio;
// - ogni evento ha un event_id univoco, usato per deduplicare Pixel e Conversions API;
// - i dati personali (user_data) entrano nel dataLayer solo con il consenso marketing.
import { hasMarketingConsent } from "@/lib/consent";
import { getAttribution } from "@/lib/attribution";

export type LeadCategory = "vendita" | "nuove_costruzioni" | "acquisto";

export type UserInput = {
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  city?: string;
};

export const newEventId = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto)
    ? crypto.randomUUID()
    : "id_" + Date.now() + "_" + Math.random().toString(36).slice(2);

const push = (data: Record<string, unknown>) => {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
};

const pagePath = () =>
  typeof window !== "undefined" ? window.location.pathname + window.location.hash : "";

export const normalizePhone = (raw?: string): string => {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("39")) return "+" + digits;
  if (digits.startsWith("00")) return "+" + digits.slice(2);
  return "+39" + digits;
};

const clean = (v?: string) => (v || "").trim().toLowerCase() || undefined;

// Dati utente nel formato di gtag("set", "user_data"): Enhanced Conversions e dati forniti dall'utente in GA4.
// Senza consenso marketing restituisce undefined.
export const buildUserData = (u?: UserInput) => {
  if (!u || !hasMarketingConsent()) return undefined;
  return {
    email: clean(u.email),
    phone_number: normalizePhone(u.phone) || undefined,
    address: {
      first_name: clean(u.first_name),
      last_name: clean(u.last_name),
      street: clean(u.street),
      city: clean(u.city),
      region: "na",
      country: "IT",
    },
  };
};

// Passa i dati utente al Google tag (Enhanced Conversions / dati forniti dall'utente in GA4).
const setGoogleUserData = (userData?: Record<string, unknown>) => {
  if (!userData || typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  const gtag = window.gtag || ((...args: unknown[]) => window.dataLayer.push(args as unknown as Record<string, unknown>));
  gtag("set", "user_data", userData);
};

export const splitName = (full: string) => {
  const [first, ...rest] = (full || "").trim().split(/\s+/);
  return { first_name: first || "", last_name: rest.join(" ") };
};

type LeadParams = {
  form_name: string;
  lead_category: LeadCategory;
  lead_type?: string;
  project?: string;
  value?: number;
  event_id?: string;
  user?: UserInput;
  extra?: Record<string, unknown>;
};

// Conversione principale: un lead commerciale (vendita, nuove costruzioni, acquisto).
export const trackLead = ({ form_name, lead_category, lead_type = "form_submit", project, value, event_id, user, extra }: LeadParams) => {
  const userData = buildUserData(user);
  setGoogleUserData(userData);
  push({
    event: "generate_lead",
    form_name,
    lead_category,
    lead_type,
    project: project || undefined,
    value: value ?? undefined,
    currency: value != null ? "EUR" : undefined,
    event_id: event_id || newEventId(),
    page_path: pagePath(),
    ...(getAttribution() || {}),
    ...(extra || {}),
    ...(userData ? { user_data: userData } : {}),
  });
};

// Candidatura di lavoro: evento separato, NON è un lead commerciale.
export const trackJobApplication = ({ event_id, user }: { event_id?: string; user?: UserInput }) => {
  const userData = buildUserData(user);
  push({
    event: "job_application",
    form_name: "lavora_con_noi",
    event_id: event_id || newEventId(),
    page_path: pagePath(),
    ...(userData ? { user_data: userData } : {}),
  });
};

export const trackFormStep = (form_name: string, step: number) => {
  push({ event: "form_step", form_name, step, page_path: pagePath() });
};

export const trackWhatsAppClick = (clickUrl: string) => {
  push({ event: "click_whatsapp", click_url: clickUrl, page_path: pagePath(), event_id: newEventId() });
};

export const trackPhoneClick = (clickUrl: string) => {
  push({ event: "click_phone", click_url: clickUrl, page_path: pagePath(), event_id: newEventId() });
};

export const trackCtaClick = (ctaText: string) => {
  push({ event: "cta_click", cta_text: ctaText, page_path: pagePath(), event_id: newEventId() });
};
