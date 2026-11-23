// Recensioni Google delle agenzie, lette in automatico dalla Google Places API (New).
// La homepage (sezione "Dicono di noi") chiama /api/recensioni; se qui qualcosa non va,
// la pagina mostra le recensioni salvate a mano in sito/src/data/reviews.ts.
//
// Variabili d'ambiente su Netlify (Project configuration → Environment variables):
//   GOOGLE_PLACES_API_KEY            → chiave di Google Cloud con "Places API (New)" attiva (obbligatoria)
//   GOOGLE_PLACE_ID_MARANO           → facoltative: Place ID fissi delle schede. Se mancano, la funzione
//   GOOGLE_PLACE_ID_MUGNANO             li cerca da sola per nome e indirizzo e controlla che la scheda
//   GOOGLE_PLACE_ID_VILLARICCA          trovata sia davvero quella dell'agenzia.
//   GOOGLE_PLACE_ID_FRATTAMAGGIORE
//
// La risposta resta in cache sulla CDN di Netlify per 12 ore: così Google viene interrogato
// circa 2 volte al giorno per agenzia, invece che a ogni visita.
// Per aggiungere un'agenzia nuova: una riga in AGENCIES (quando avrà la sua scheda Google).

const AGENCIES = [
  { key: "MARANO", agency: "Gabetti Marano", town: "Marano", query: "Gabetti Franchising Marano di Napoli, Via Vincenzo Merolla 53, Marano di Napoli" },
  { key: "MUGNANO", agency: "Gabetti Mugnano", town: "Mugnano", query: "Gabetti Franchising Mugnano, Via Giorgio Perlasca 10, Mugnano di Napoli" },
  { key: "VILLARICCA", agency: "Gabetti Villaricca - Qualiano", town: "Villaricca", query: "Gabetti Franchising Villaricca, Corso Italia 777, Villaricca" },
  { key: "FRATTAMAGGIORE", agency: "Gabetti Frattamaggiore", town: "Frattamaggiore", query: "Gabetti Franchising Frattamaggiore, Via Vittorio Emanuele III 44, Frattamaggiore" },
];

/** Recensioni con voto inferiore non vengono mostrate in homepage. */
const MIN_STARS = 4;
const API = "https://places.googleapis.com/v1";
const CACHE_SECONDS = 12 * 60 * 60;

const json = (status, body, cache = false) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": cache ? "public, max-age=3600" : "no-store",
      ...(cache && { "Netlify-CDN-Cache-Control": `public, durable, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}` }),
    },
  });

const headers = (key, fieldMask) => ({ "X-Goog-Api-Key": key, "X-Goog-FieldMask": fieldMask, "Content-Type": "application/json" });

/** Cerca i Place ID per nome e indirizzo (solo ID: è la ricerca più economica). */
const searchIds = async (key, a) => {
  const res = await fetch(`${API}/places:searchText`, {
    method: "POST",
    headers: headers(key, "places.id"),
    body: JSON.stringify({
      textQuery: a.query,
      languageCode: "it",
      regionCode: "IT",
      locationBias: { circle: { center: { latitude: 40.92, longitude: 14.22 }, radius: 20000 } },
    }),
  });
  if (!res.ok) throw new Error(`searchText ${a.key}: ${res.status} ${await res.text()}`);
  return ((await res.json()).places || []).map((p) => p.id).slice(0, 3);
};

const details = async (key, id) => {
  const res = await fetch(`${API}/places/${encodeURIComponent(id)}?languageCode=it&regionCode=IT`, {
    headers: headers(key, "id,displayName,formattedAddress,rating,userRatingCount,googleMapsUri,reviews"),
  });
  if (!res.ok) throw new Error(`details ${id}: ${res.status} ${await res.text()}`);
  return res.json();
};

/** La scheda è quella giusta se è Gabetti e l'indirizzo è nel comune dell'agenzia. */
const matches = (place, a) =>
  /gabetti/i.test(place.displayName?.text || "") && (place.formattedAddress || "").toLowerCase().includes(a.town.toLowerCase());

const loadAgency = async (key, a) => {
  const fixed = process.env[`GOOGLE_PLACE_ID_${a.key}`];
  const ids = fixed ? [fixed] : await searchIds(key, a);
  for (const id of ids) {
    const place = await details(key, id);
    if (fixed || matches(place, a)) return { a, place };
  }
  throw new Error(`Nessuna scheda Google trovata per ${a.agency}`);
};

export default async () => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return json(503, { ok: false, error: "GOOGLE_PLACES_API_KEY non impostata" });

  const results = await Promise.allSettled(AGENCIES.map((a) => loadAgency(key, a)));
  const found = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
  results.filter((r) => r.status === "rejected").forEach((r) => console.error(String(r.reason)));
  if (!found.length) return json(502, { ok: false, error: "Google non ha risposto" });

  const agencies = found.map(({ a, place }) => ({
    agency: a.agency,
    placeId: place.id,
    rating: place.rating ?? null,
    count: place.userRatingCount ?? 0,
    url: place.googleMapsUri,
  }));

  // Recensioni di ogni agenzia (Google ne dà al massimo 5), poi alternate tra le agenzie
  const perAgency = found.map(({ a, place }) =>
    (place.reviews || [])
      .filter((r) => (r.rating ?? 0) >= MIN_STARS && (r.text?.text || r.originalText?.text))
      .map((r) => ({
        agency: a.agency,
        stars: r.rating,
        text: (r.text?.text || r.originalText?.text).trim(),
        author: r.authorAttribution?.displayName || "Cliente Google",
        authorUrl: r.authorAttribution?.uri || null,
        when: r.relativePublishTimeDescription || null,
        url: r.googleMapsUri || place.googleMapsUri,
      })),
  );
  const reviews = [];
  for (let i = 0; perAgency.some((list) => list[i]); i++) perAgency.forEach((list) => list[i] && reviews.push(list[i]));

  return json(200, { ok: true, updated: new Date().toISOString(), agencies, reviews }, true);
};

export const config = { path: "/api/recensioni" };
