// Invio dei form del sito alla funzione Netlify /.netlify/functions/sito-form,
// che inoltra a GoHighLevel (webhook nelle variabili d'ambiente di Netlify, mai nel codice).

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const UTM_STORE = "gabetti_utm";

// Conserva gli UTM della prima pagina visitata, così arrivano anche se il form è su un'altra pagina
try {
  const params = new URLSearchParams(window.location.search);
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k)]).filter(([, v]) => v));
  if (Object.keys(utm).length) sessionStorage.setItem(UTM_STORE, JSON.stringify(utm));
} catch { /* sessionStorage non disponibile */ }

const storedUtm = (): Record<string, string> => {
  try { return JSON.parse(sessionStorage.getItem(UTM_STORE) || "{}"); } catch { return {}; }
};

export type SiteForm = "valutazione" | "candidatura";

export async function sendSiteForm(form: SiteForm, payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/.netlify/functions/sito-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...storedUtm(), ...payload, form }),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}
