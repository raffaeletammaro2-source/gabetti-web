import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;
export type Zone = Tables<"zones">;

export const PAGE_SIZE = 25;
export const VALUTA_URL = "https://gabetti-adg.it";

export const TYPES: Record<string, string> = {
  appartamento: "Appartamento",
  attico: "Attico",
  villa: "Villa",
  casa_indipendente: "Casa indipendente",
  loft: "Loft",
  rustico: "Rustico",
  villetta_schiera: "Villetta a schiera",
  nuova_costruzione: "Nuova costruzione",
};

export const CONDITIONS: Record<string, string> = {
  nuovo: "Nuovo / In costruzione",
  ottimo: "Ottimo / Ristrutturato",
  buono: "Buono / Abitabile",
  da_ristrutturare: "Da ristrutturare",
};

export const FEATURES: { key: keyof Property; label: string; param: string }[] = [
  { key: "has_elevator", label: "Ascensore", param: "ascensore" },
  { key: "has_garage", label: "Garage/Box", param: "garage" },
  { key: "has_cellar", label: "Cantina", param: "cantina" },
  { key: "has_terrace", label: "Terrazzo", param: "terrazzo" },
  { key: "has_balcony", label: "Balcone", param: "balcone" },
  { key: "has_garden", label: "Giardino", param: "giardino" },
  { key: "has_pool", label: "Piscina", param: "piscina" },
  { key: "is_furnished", label: "Arredato", param: "arredato" },
  { key: "has_air_conditioning", label: "Aria condizionata", param: "clima" },
  { key: "sea_view", label: "Vista mare", param: "vista_mare" },
];

export const ENERGY = ["A4", "A3", "A2", "A1", "B", "C", "D", "E", "F", "G"];
export const PRICE_STEPS = [50000, 75000, 100000, 125000, 150000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000];
export const SURFACE_STEPS = [40, 60, 80, 100, 120, 150, 200];

export const SORTS: Record<string, string> = {
  rilevanza: "Più rilevanti",
  prezzo_asc: "Prezzo più basso",
  prezzo_desc: "Prezzo più alto",
  mq_desc: "Superficie maggiore",
  recenti: "Più recenti",
};

const eur = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
export const formatPrice = (n: number) => eur.format(n).replace(/\s?€/, "").trim().replace(/^/, "€ ");
export const formatNum = (n: number) => new Intl.NumberFormat("it-IT").format(n);
export const shortPrice = (n: number) => (n >= 1000000 ? `€${(n / 1000000).toLocaleString("it-IT", { maximumFractionDigits: 1 })}M` : `€${Math.round(n / 1000)}k`);

export const propertyUrl = (p: Pick<Property, "slug" | "id">) => `/immobile/${p.slug}-${p.id}`;
export const isNew = (p: Property) => Date.now() - new Date(p.created_at).getTime() < 7 * 86400000;
export const floorLabel = (f: string | null) =>
  !f ? null : f === "terra" ? "Piano terra" : f === "ultimo" ? "Ultimo piano" : f === "intermedio" ? "Piano intermedio" : `Piano ${f}`;

export const list = (sp: URLSearchParams, key: string) => (sp.get(key) || "").split(",").filter(Boolean);
const num = (sp: URLSearchParams, key: string) => {
  const v = Number(sp.get(key));
  return Number.isFinite(v) && v > 0 ? v : null;
};

/** Applies the URL filters to a server-side query. */
export function applyFilters<Q extends { [k: string]: any }>(q: Q, sp: URLSearchParams, city?: string, zone?: string): Q {
  let r: any = q.eq("is_published", true).eq("contract", "vendita");
  if (city) r = r.eq("city_slug", city);
  const zones = zone ? [zone] : list(sp, "zone");
  if (zones.length) r = r.in("zone_slug", zones);
  const tipo = list(sp, "tipo");
  if (tipo.length) r = r.in("property_type", tipo);
  const pmin = num(sp, "prezzo_min"), pmax = num(sp, "prezzo_max");
  if (pmin) r = r.gte("price", pmin);
  if (pmax) r = r.lte("price", pmax);
  const mmin = num(sp, "mq_min"), mmax = num(sp, "mq_max");
  if (mmin) r = r.gte("surface_m2", mmin);
  if (mmax) r = r.lte("surface_m2", mmax);
  const locali = list(sp, "locali").map(Number);
  if (locali.length) {
    const exact = locali.filter((n) => n < 5);
    const parts = [exact.length ? `rooms.in.(${exact.join(",")})` : "", locali.includes(5) ? "rooms.gte.5" : ""].filter(Boolean);
    r = r.or(parts.join(","));
  }
  const bagni = num(sp, "bagni");
  if (bagni) r = r.gte("bathrooms", bagni);
  const piano = list(sp, "piano");
  if (piano.length) r = r.in("floor", piano.flatMap((p) => (p === "intermedio" ? ["intermedio", "1", "2", "3", "4", "5", "6"] : [p])));
  const stato = list(sp, "stato");
  if (stato.length) r = r.in("condition", stato);
  const risc = sp.get("riscaldamento");
  if (risc) r = r.eq("heating", risc);
  const ec = list(sp, "classe");
  if (ec.length) r = r.in("energy_class", ec);
  for (const f of FEATURES) if (sp.get(f.param) === "1") r = r.eq(f.key as string, true);
  if (sp.get("virtual") === "1") r = r.eq("has_virtual_tour", true);
  if (sp.get("esclusiva") === "1") r = r.eq("is_exclusive", true);
  const pub = sp.get("pubblicati");
  const days = pub === "24h" ? 1 : pub === "settimana" ? 7 : pub === "mese" ? 30 : 0;
  if (days) r = r.gte("created_at", new Date(Date.now() - days * 86400000).toISOString());
  const kw = (sp.get("q") || "").replace(/[,()%]/g, " ").trim().slice(0, 60);
  if (kw) r = r.or(`title.ilike.%${kw}%,description.ilike.%${kw}%`);
  const bbox = (sp.get("area") || "").split(",").map(Number);
  if (bbox.length === 4 && bbox.every(Number.isFinite)) {
    const [s, w, n, e] = bbox;
    r = r.gte("lat", s).lte("lat", n).gte("lng", w).lte("lng", e);
  }
  return r;
}

export function applySort(q: any, sort: string | null) {
  switch (sort) {
    case "prezzo_asc": return q.order("price", { ascending: true });
    case "prezzo_desc": return q.order("price", { ascending: false });
    case "mq_desc": return q.order("surface_m2", { ascending: false });
    case "recenti": return q.order("created_at", { ascending: false });
    default: return q.order("is_exclusive", { ascending: false }).order("created_at", { ascending: false });
  }
}

export async function fetchProperties(sp: URLSearchParams, city?: string, zone?: string) {
  const page = Math.max(1, Number(sp.get("pag")) || 1);
  let q = applyFilters(supabase.from("properties").select("*", { count: "exact" }), sp, city, zone);
  q = applySort(q, sp.get("ordine"));
  const { data, count, error } = await q.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw error;
  return { items: (data || []) as Property[], total: count || 0, page };
}

export async function countProperties(sp: URLSearchParams, city?: string, zone?: string) {
  const { count } = await applyFilters(supabase.from("properties").select("id", { count: "exact", head: true }), sp, city, zone);
  return count || 0;
}

export async function fetchZones() {
  const { data } = await supabase.from("zones").select("*").order("city").order("name");
  return (data || []) as Zone[];
}

export async function fetchMapProperties(sp: URLSearchParams, city?: string, zone?: string) {
  const q = applyFilters(supabase.from("properties").select("*").not("lat", "is", null), sp, city, zone);
  const { data, error } = await q.limit(500);
  if (error) throw error;
  return (data || []) as Property[];
}
