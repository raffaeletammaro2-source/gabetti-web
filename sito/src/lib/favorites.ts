import { useSyncExternalStore } from "react";

/** Preferiti e ricerche salvate: memorizzati sul dispositivo del visitatore (nessun account richiesto). */
const FAV_KEY = "gab_favorites";
const SEARCH_KEY = "gab_saved_searches";
const EVT = "gab-store-change";

export type SavedSearch = { id: string; label: string; url: string; created: number };

const read = <T,>(k: string, d: T): T => {
  try { return JSON.parse(localStorage.getItem(k) || "") ?? d; } catch { return d; }
};
const write = (k: string, v: unknown) => {
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new Event(EVT));
};

const cache: Record<string, { raw: string | null; val: unknown }> = {};
const snap = <T,>(k: string, d: T) => () => {
  const raw = localStorage.getItem(k);
  if (cache[k]?.raw !== raw) cache[k] = { raw, val: read(k, d) };
  return cache[k].val as T;
};
const subscribe = (cb: () => void) => {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
};
const EMPTY: never[] = [];
const favSnap = snap<string[]>(FAV_KEY, EMPTY);
const searchSnap = snap<SavedSearch[]>(SEARCH_KEY, EMPTY);

export const useFavorites = () => useSyncExternalStore(subscribe, favSnap, () => EMPTY as string[]);
export const toggleFavorite = (id: string) => {
  const f = read<string[]>(FAV_KEY, []);
  write(FAV_KEY, f.includes(id) ? f.filter((x) => x !== id) : [id, ...f]);
};

export const useSavedSearches = () => useSyncExternalStore(subscribe, searchSnap, () => EMPTY as SavedSearch[]);
export const saveSearch = (label: string, url: string) => {
  const s = read<SavedSearch[]>(SEARCH_KEY, []).filter((x) => x.url !== url);
  write(SEARCH_KEY, [{ id: crypto.randomUUID(), label, url, created: Date.now() }, ...s].slice(0, 20));
};
export const removeSearch = (id: string) => write(SEARCH_KEY, read<SavedSearch[]>(SEARCH_KEY, []).filter((x) => x.id !== id));
