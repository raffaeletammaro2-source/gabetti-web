// Riceve i form del sito principale (sito/) e li inoltra a GoHighLevel.
// Sostituisce le funzioni di Lovable Cloud (forward-lead-webhook e send-transactional-email):
// le email di conferma e di avviso partono dai workflow di GoHighLevel.
//
// I webhook NON sono nel codice: vanno impostati su Netlify come variabili d'ambiente
// (Project configuration → Environment variables):
//   GHL_WEBHOOK_URL_VALUTAZIONE  → form "Valuta casa" (home e pagine delle città)
//   GHL_WEBHOOK_URL_CANDIDATURE  → form "Lavora con noi"
//
// Ai webhook arrivano gli stessi campi che mandava Lovable, così i workflow esistenti non cambiano.

const FORMS = {
  valutazione: {
    env: "GHL_WEBHOOK_URL_VALUTAZIONE",
    fields: [
      "event_id", "submitted_at", "page_url", "form_name",
      "first_name", "last_name", "full_name", "email", "phone",
      "property_type", "sqm", "condition", "zone", "address", "timeline", "experience",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    ],
  },
  candidatura: {
    env: "GHL_WEBHOOK_URL_CANDIDATURE",
    fields: [
      "event_id", "submitted_at", "page_url", "form_name",
      "first_name", "last_name", "full_name", "email", "phone", "experience", "letter",
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
    ],
  },
};

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false });

  let data;
  try { data = await req.json(); } catch { return json(400, { ok: false }); }

  const form = FORMS[data?.form];
  if (!form) return json(400, { ok: false, error: "form" });

  // Campo trappola anti-spam: se è compilato è un bot, rispondiamo ok senza inoltrare
  if (data.website || data.sito_web) return json(200, { ok: true });

  const s = (v, max = 255) =>
    (typeof v === "string" || typeof v === "number" ? String(v).trim().slice(0, max) : "") || null;

  const fullName = s(data.full_name, 120);
  const email = s(data.email);
  const phone = s(data.phone, 30);
  if (!fullName || fullName.length < 2) return json(400, { ok: false, error: "nome" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(400, { ok: false, error: "email" });
  if (!phone || !/^[+0-9 ().-]{6,30}$/.test(phone)) return json(400, { ok: false, error: "telefono" });
  if (data.gdpr !== true) return json(400, { ok: false, error: "privacy" });

  const payload = {};
  for (const k of form.fields) payload[k] = s(data[k], k === "letter" ? 5000 : 500);
  payload.full_name = fullName;
  payload.email = email;
  payload.phone = phone;
  payload.gdpr = true;
  payload.submitted_at = payload.submitted_at || new Date().toISOString();

  const webhook = process.env[form.env];
  if (!webhook) {
    console.error(form.env + " non impostata");
    return json(500, { ok: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("GoHighLevel ha risposto", res.status);
      return json(502, { ok: false });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("Errore invio a GoHighLevel", err);
    return json(502, { ok: false });
  }
};
