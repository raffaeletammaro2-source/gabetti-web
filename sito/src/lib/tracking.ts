declare global {
  interface Window { dataLayer: Record<string, unknown>[]; }
}

const uuid = () =>
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

export const trackWhatsAppClick = (clickUrl: string) => {
  push({
    event: "click_whatsapp",
    click_url: clickUrl,
    page_path: pagePath(),
    event_id: uuid(),
  });
};

export const trackPhoneClick = (clickUrl: string) => {
  push({
    event: "click_phone",
    click_url: clickUrl,
    page_path: pagePath(),
    event_id: uuid(),
  });
};

export const trackCtaClick = (ctaText: string) => {
  push({
    event: "cta_click",
    cta_text: ctaText,
    page_path: pagePath(),
    event_id: uuid(),
  });
};

export const trackGenerateLead = (formName: string) => {
  push({
    event: "generate_lead",
    form_name: formName,
    lead_type: "form_submit",
    page_path: pagePath(),
    event_id: uuid(),
  });
};
