import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, X } from "lucide-react";
import { fetchZones, TYPES, VALUTA_URL } from "@/lib/properties";

type Place = { kind: "city" | "zone"; label: string; city: string; citySlug: string; slug?: string };

const SearchBar = ({ initialCity, initialZones = [], initialType = "" }: { initialCity?: string; initialZones?: string[]; initialType?: string }) => {
  const navigate = useNavigate();
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: fetchZones, staleTime: 3600000 });
  const places = useMemo<Place[]>(() => {
    const cities = new Map<string, string>();
    zones.forEach((z) => cities.set(z.city_slug, z.city));
    return [
      ...[...cities].map(([s, c]) => ({ kind: "city" as const, label: c, city: c, citySlug: s })),
      ...zones.map((z) => ({ kind: "zone" as const, label: z.name, city: z.city, citySlug: z.city_slug, slug: z.slug })),
    ];
  }, [zones]);
  const [sel, setSel] = useState<Place[]>([]);
  const [text, setText] = useState("");
  const [focus, setFocus] = useState(false);
  const [tipo, setTipo] = useState(initialType);

  useEffect(() => {
    if (!places.length) return;
    const s: Place[] = [];
    if (initialCity) {
      if (initialZones.length) initialZones.forEach((z) => { const p = places.find((x) => x.kind === "zone" && x.citySlug === initialCity && x.slug === z); if (p) s.push(p); });
      else { const c = places.find((x) => x.kind === "city" && x.citySlug === initialCity); if (c) s.push(c); }
    }
    setSel(s);
  }, [places, initialCity, initialZones.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = text.trim().toLowerCase();
  const suggestions = q ? places.filter((p) => p.label.toLowerCase().includes(q) && !sel.includes(p)).slice(0, 8) : [];

  const add = (p: Place) => {
    // Zones must belong to one city; picking a city replaces everything.
    setSel(p.kind === "city" ? [p] : [...sel.filter((s) => s.kind === "zone" && s.citySlug === p.citySlug), p]);
    setText("");
  };

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tipo) params.set("tipo", tipo);
    const zs = sel.filter((s) => s.kind === "zone");
    let path = "/compra";
    if (sel.length) {
      path += `/${sel[0].citySlug}`;
      if (zs.length === 1) path += `/${zs[0].slug}`;
      else if (zs.length > 1) params.set("zone", zs.map((z) => z.slug).join(","));
    }
    const qs = params.toString();
    navigate(path + (qs ? `?${qs}` : ""));
  };

  return (
    <div className="rounded-xl bg-card p-3 shadow-lg border border-[hsl(var(--listing-border))]">
      <div className="mb-3 flex gap-1 text-sm font-bold" role="tablist">
        <span role="tab" aria-selected="true" className="rounded-lg bg-primary px-4 py-2 text-primary-foreground">Compra</span>
        <span role="tab" aria-selected="false" aria-disabled="true" title="Presto disponibile" className="cursor-not-allowed rounded-lg px-4 py-2 text-muted-foreground">Affitta</span>
        <a role="tab" aria-selected="false" href={VALUTA_URL} className="rounded-lg px-4 py-2 text-foreground hover:text-primary">Valuta casa</a>
      </div>
      <form onSubmit={go} className="flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <label htmlFor="where" className="sr-only">Dove cerchi?</label>
          <div className="flex min-h-[48px] flex-wrap items-center gap-1 rounded-lg border border-input px-3 py-1.5 focus-within:ring-2 focus-within:ring-ring">
            <MapPin className="h-4 w-4 text-secondary" aria-hidden />
            {sel.map((s) => (
              <span key={s.label + s.citySlug} className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {s.label}
                <button type="button" aria-label={`Rimuovi ${s.label}`} onClick={() => setSel(sel.filter((x) => x !== s))}><X className="h-3 w-3" /></button>
              </span>
            ))}
            <input id="where" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
              placeholder={sel.length ? "Aggiungi zona…" : "Dove cerchi? Comune o zona"} className="min-w-[140px] flex-1 bg-transparent py-1 text-sm outline-none" />
          </div>
          {focus && suggestions.length > 0 && (
            <ul className="absolute left-0 right-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-lg" role="listbox">
              {suggestions.map((p) => (
                <li key={p.kind + p.citySlug + (p.slug || "")}>
                  <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => add(p)} className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted">
                    <span className="font-semibold">{p.label}{p.kind === "zone" && <span className="font-normal text-muted-foreground">, {p.city}</span>}</span>
                    <span className="text-xs text-muted-foreground">{p.kind === "city" ? "Comune" : "Zona"}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <label htmlFor="tipo-s" className="sr-only">Tipologia</label>
        <select id="tipo-s" value={tipo} onChange={(e) => setTipo(e.target.value)} className="h-12 rounded-lg border border-input bg-background px-3 text-sm">
          <option value="">Tutte le tipologie</option>
          {Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <button type="submit" className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 font-bold text-primary-foreground hover:bg-[hsl(var(--primary-dark))]">
          <Search className="h-4 w-4" />Cerca
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
