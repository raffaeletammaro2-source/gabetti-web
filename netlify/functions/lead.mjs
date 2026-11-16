// Riceve i contatti dai form delle landing e li inoltra a GoHighLevel.
// I webhook NON sono nel codice: vanno impostati su Netlify come variabili d'ambiente
// (Project configuration → Environment variables).
//   GHL_WEBHOOK_URL                        → webhook predefinito, usato da tutte le landing
//   GHL_WEBHOOK_URL_<SLUG>                 → webhook dedicato a una landing di /cantieri/<slug>/
//                                            (slug in maiuscolo, trattini → trattini bassi)
//   es. /cantieri/via-pietro-nenni-mugnano/ → GHL_WEBHOOK_URL_VIA_PIETRO_NENNI_MUGNANO

const FIELDS = [
  "nome", "telefono", "email", "citta", "tipologia", "messaggio",
  "progetto", "source", "pagina",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
];

const json = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json(405, { ok: false });

  let data;
  try { data = await req.json(); } catch { return json(400, { ok: false }); }

  // Campo trappola anti-spam: se è compilato è un bot, rispondiamo ok senza inoltrare
  if (data.sito_web) return json(200, { ok: true });

  const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : null) || null;
  const nome = s(data.nome, 100);
  const telefono = s(data.telefono, 25);
  const email = s(data.email, 255);
  if (!nome || nome.length < 2) return json(400, { ok: false, error: "nome" });
  if (!telefono || !/^[+0-9 ().-]{6,25}$/.test(telefono)) return json(400, { ok: false, error: "telefono" });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(400, { ok: false, error: "email" });
  if (data.privacy_consenso !== true) return json(400, { ok: false, error: "privacy" });

  const lead = {};
  for (const k of FIELDS) lead[k] = s(data[k], 255);
  const [firstName, ...rest] = nome.split(" ");
  const payload = {
    ...lead,
    first_name: firstName,
    last_name: rest.join(" ") || null,
    phone: telefono,
    city: lead.citta,
    privacy_consenso: true,
    submitted_at: new Date().toISOString(),
  };

  // Webhook dedicato alla landing, se esiste; altrimenti quello predefinito
  const slug = (lead.pagina || "").match(/^\/cantieri\/([a-z0-9-]+)\/?/)?.[1];
  const dedicated = slug ? "GHL_WEBHOOK_URL_" + slug.toUpperCase().replace(/-/g, "_") : null;
  const webhook = (dedicated && process.env[dedicated]) || process.env.GHL_WEBHOOK_URL;
  if (!webhook) {
    console.error("Nessun webhook impostato (" + (dedicated || "GHL_WEBHOOK_URL") + ")");
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
