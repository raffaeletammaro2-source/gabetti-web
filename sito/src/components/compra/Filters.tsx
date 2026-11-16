import { useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TYPES, CONDITIONS, FEATURES, ENERGY, PRICE_STEPS, SURFACE_STEPS, list, shortPrice, countProperties } from "@/lib/properties";

type Setter = (patch: Record<string, string | null>) => void;

const Pill = ({ active, label, children }: { active: boolean; label: string; children: React.ReactNode }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" className={`flex items-center gap-1 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-[hsl(var(--listing-border))] bg-card text-foreground hover:border-primary"}`}>
        {label}<ChevronDown className="h-4 w-4" aria-hidden />
      </button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-80">{children}</PopoverContent>
  </Popover>
);

const Toggle = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button type="button" aria-pressed={on} onClick={onClick}
    className={`min-w-[44px] rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{children}</button>
);

const toggleIn = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const joinOrNull = (a: string[]) => (a.length ? a.join(",") : null);

/** Numeric min/max with step presets and free input, debounced 300ms. */
const RangeInput = ({ sp, set, minKey, maxKey, steps, fmt, unit }: { sp: URLSearchParams; set: Setter; minKey: string; maxKey: string; steps: number[]; fmt: (n: number) => string; unit: string }) => {
  const [v, setV] = useState({ min: sp.get(minKey) || "", max: sp.get(maxKey) || "" });
  useEffect(() => setV({ min: sp.get(minKey) || "", max: sp.get(maxKey) || "" }), [sp, minKey, maxKey]);
  useEffect(() => {
    const t = setTimeout(() => {
      if ((sp.get(minKey) || "") !== v.min || (sp.get(maxKey) || "") !== v.max) set({ [minKey]: v.min || null, [maxKey]: v.max || null });
    }, 300);
    return () => clearTimeout(t);
  }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["min", "max"] as const).map((k) => (
        <div key={k}>
          <label className="text-xs font-semibold text-muted-foreground" htmlFor={`${minKey}-${k}`}>{k === "min" ? "Min" : "Max"} ({unit})</label>
          <Input id={`${minKey}-${k}`} inputMode="numeric" list={`${minKey}-steps`} value={v[k]} placeholder="Indifferente"
            onChange={(e) => setV({ ...v, [k]: e.target.value.replace(/\D/g, "") })} />
        </div>
      ))}
      <datalist id={`${minKey}-steps`}>{steps.map((s) => <option key={s} value={s}>{fmt(s)}</option>)}</datalist>
      <div className="col-span-2 flex flex-wrap gap-1">
        {steps.map((s) => (
          <button key={s} type="button" className="rounded border border-border px-2 py-0.5 text-xs hover:border-primary"
            onClick={() => setV(!v.min || (v.max && Number(v.min) >= s) ? { ...v, min: String(s) } : { ...v, max: String(s) })}>{fmt(s)}</button>
        ))}
      </div>
    </div>
  );
};

const TypeChecks = ({ sp, set }: { sp: URLSearchParams; set: Setter }) => {
  const sel = list(sp, "tipo");
  return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(TYPES).map(([k, l]) => (
        <label key={k} className="flex items-center gap-2 text-sm"><Checkbox checked={sel.includes(k)} onCheckedChange={() => set({ tipo: joinOrNull(toggleIn(sel, k)) })} />{l}</label>
      ))}
    </div>
  );
};

const RoomsToggle = ({ sp, set }: { sp: URLSearchParams; set: Setter }) => {
  const sel = list(sp, "locali");
  return <div className="flex gap-2">{["1", "2", "3", "4", "5"].map((r) => <Toggle key={r} on={sel.includes(r)} onClick={() => set({ locali: joinOrNull(toggleIn(sel, r)) })}>{r === "5" ? "5+" : r}</Toggle>)}</div>;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-2 border-b border-border pb-4"><legend className="mb-2 font-bold text-foreground">{title}</legend>{children}</fieldset>
);

const AllFilters = ({ sp, set, full }: { sp: URLSearchParams; set: Setter; full?: boolean }) => {
  const multi = (key: string, v: string) => set({ [key]: joinOrNull(toggleIn(list(sp, key), v)) });
  return (
    <div className="space-y-4">
      {full && (
        <>
          <Section title="Tipologia"><TypeChecks sp={sp} set={set} /></Section>
          <Section title="Prezzo"><RangeInput sp={sp} set={set} minKey="prezzo_min" maxKey="prezzo_max" steps={PRICE_STEPS} fmt={shortPrice} unit="€" /></Section>
          <Section title="Superficie"><RangeInput sp={sp} set={set} minKey="mq_min" maxKey="mq_max" steps={SURFACE_STEPS} fmt={(n) => `${n} m²`} unit="m²" /></Section>
          <Section title="Locali"><RoomsToggle sp={sp} set={set} /></Section>
        </>
      )}
      <Section title="Bagni"><div className="flex gap-2">{["1", "2", "3"].map((b) => <Toggle key={b} on={sp.get("bagni") === b} onClick={() => set({ bagni: sp.get("bagni") === b ? null : b })}>{b === "3" ? "3+" : `${b}+`}</Toggle>)}</div></Section>
      <Section title="Piano"><div className="flex flex-wrap gap-2">{[["terra", "Piano terra"], ["intermedio", "Piani intermedi"], ["ultimo", "Ultimo piano"]].map(([k, l]) => <Toggle key={k} on={list(sp, "piano").includes(k)} onClick={() => multi("piano", k)}>{l}</Toggle>)}</div></Section>
      <Section title="Stato">{Object.entries(CONDITIONS).map(([k, l]) => <label key={k} className="flex items-center gap-2 text-sm"><Checkbox checked={list(sp, "stato").includes(k)} onCheckedChange={() => multi("stato", k)} />{l}</label>)}</Section>
      <Section title="Riscaldamento"><div className="flex gap-2">{[["autonomo", "Autonomo"], ["centralizzato", "Centralizzato"]].map(([k, l]) => <Toggle key={k} on={sp.get("riscaldamento") === k} onClick={() => set({ riscaldamento: sp.get("riscaldamento") === k ? null : k })}>{l}</Toggle>)}</div></Section>
      <Section title="Classe energetica"><div className="flex flex-wrap gap-1">{ENERGY.map((e) => <Toggle key={e} on={list(sp, "classe").includes(e)} onClick={() => multi("classe", e)}>{e}</Toggle>)}</div></Section>
      <Section title="Caratteristiche">
        <div className="grid grid-cols-2 gap-2">{FEATURES.map((f) => <label key={f.param} className="flex items-center gap-2 text-sm"><Checkbox checked={sp.get(f.param) === "1"} onCheckedChange={(v) => set({ [f.param]: v ? "1" : null })} />{f.label}</label>)}</div>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={sp.get("virtual") === "1"} onCheckedChange={(v) => set({ virtual: v ? "1" : null })} />Solo con visita virtuale</label>
        <label className="flex items-center gap-2 text-sm"><Checkbox checked={sp.get("esclusiva") === "1"} onCheckedChange={(v) => set({ esclusiva: v ? "1" : null })} />Solo esclusive Gabetti</label>
      </Section>
      <Section title="Pubblicati">
        <div className="flex flex-wrap gap-2">{[["", "Qualsiasi"], ["24h", "Ultime 24h"], ["settimana", "Ultima settimana"], ["mese", "Ultimo mese"]].map(([k, l]) => <Toggle key={k} on={(sp.get("pubblicati") || "") === k} onClick={() => set({ pubblicati: k || null })}>{l}</Toggle>)}</div>
      </Section>
      <KeywordInput sp={sp} set={set} />
    </div>
  );
};

const KeywordInput = ({ sp, set }: { sp: URLSearchParams; set: Setter }) => {
  const [v, setV] = useState(sp.get("q") || "");
  useEffect(() => { const t = setTimeout(() => (sp.get("q") || "") !== v && set({ q: v || null }), 300); return () => clearTimeout(t); }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  return <div><label htmlFor="kw" className="font-bold">Parola chiave</label><Input id="kw" value={v} maxLength={60} placeholder="es. terrazzo panoramico" onChange={(e) => setV(e.target.value)} /></div>;
};

export const FILTER_KEYS = ["tipo", "prezzo_min", "prezzo_max", "mq_min", "mq_max", "locali", "bagni", "piano", "stato", "riscaldamento", "classe", "virtual", "esclusiva", "pubblicati", "q", "zone", ...FEATURES.map((f) => f.param)];
const ADV_KEYS = ["bagni", "piano", "stato", "riscaldamento", "classe", "virtual", "esclusiva", "pubblicati", "q", ...FEATURES.map((f) => f.param)];

const FilterSheet = ({ open, onOpenChange, sp, set, city, zone, full }: { open: boolean; onOpenChange: (o: boolean) => void; sp: URLSearchParams; set: Setter; city?: string; zone?: string; full?: boolean }) => {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => { if (open) countProperties(sp, city, zone).then(setN); }, [sp, open, city, zone]);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader><SheetTitle>{full ? "Filtri" : "Altri filtri"}</SheetTitle></SheetHeader>
        <div className="flex-1 overflow-y-auto pr-1"><AllFilters sp={sp} set={set} full={full} /></div>
        <SheetFooter className="flex-row gap-2 border-t border-border pt-3">
          <Button variant="outline" className="flex-1" onClick={() => set(Object.fromEntries((full ? FILTER_KEYS : ADV_KEYS).map((k) => [k, null])))}>Rimuovi filtri</Button>
          <Button className="flex-1 font-bold" onClick={() => onOpenChange(false)}>Mostra {n ?? "…"} risultati</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const activeChips = (sp: URLSearchParams): { key: string; label: string }[] => {
  const c: { key: string; label: string }[] = [];
  list(sp, "tipo").forEach((t) => c.push({ key: `tipo:${t}`, label: TYPES[t] || t }));
  if (sp.get("prezzo_min") || sp.get("prezzo_max")) c.push({ key: "prezzo", label: priceLabel(sp) });
  if (sp.get("mq_min") || sp.get("mq_max")) c.push({ key: "mq", label: `${sp.get("mq_min") || 0}–${sp.get("mq_max") || "∞"} m²` });
  if (sp.get("locali")) c.push({ key: "locali", label: `Locali: ${list(sp, "locali").map((l) => (l === "5" ? "5+" : l)).join(", ")}` });
  if (sp.get("bagni")) c.push({ key: "bagni", label: `${sp.get("bagni")}+ bagni` });
  list(sp, "stato").forEach((s) => c.push({ key: `stato:${s}`, label: CONDITIONS[s] }));
  list(sp, "piano").forEach((s) => c.push({ key: `piano:${s}`, label: s === "terra" ? "Piano terra" : s === "ultimo" ? "Ultimo piano" : "Piani intermedi" }));
  if (sp.get("riscaldamento")) c.push({ key: "riscaldamento", label: `Risc. ${sp.get("riscaldamento")}` });
  list(sp, "classe").forEach((s) => c.push({ key: `classe:${s}`, label: `Classe ${s}` }));
  FEATURES.forEach((f) => sp.get(f.param) === "1" && c.push({ key: f.param, label: f.label }));
  if (sp.get("virtual")) c.push({ key: "virtual", label: "Visita virtuale" });
  if (sp.get("esclusiva")) c.push({ key: "esclusiva", label: "Esclusive Gabetti" });
  if (sp.get("pubblicati")) c.push({ key: "pubblicati", label: `Pubblicati: ${sp.get("pubblicati")}` });
  if (sp.get("q")) c.push({ key: "q", label: `"${sp.get("q")}"` });
  return c;
};

const priceLabel = (sp: URLSearchParams) => {
  const a = sp.get("prezzo_min"), b = sp.get("prezzo_max");
  return a && b ? `${shortPrice(+a)} – ${shortPrice(+b)}` : a ? `da ${shortPrice(+a)}` : `fino a ${shortPrice(+b!)}`;
};

export const removeChip = (sp: URLSearchParams, key: string): Record<string, string | null> => {
  const [k, v] = key.split(":");
  if (v) return { [k]: joinOrNull(list(sp, k).filter((x) => x !== v)) };
  if (k === "prezzo") return { prezzo_min: null, prezzo_max: null };
  if (k === "mq") return { mq_min: null, mq_max: null };
  return { [k]: null };
};

const FiltersBar = ({ sp, set, city, zone, right }: { sp: URLSearchParams; set: Setter; city?: string; zone?: string; right?: React.ReactNode }) => {
  const [sheet, setSheet] = useState<null | "adv" | "full">(null);
  const tipo = list(sp, "tipo"), locali = list(sp, "locali");
  const hasPrice = !!(sp.get("prezzo_min") || sp.get("prezzo_max"));
  const hasMq = !!(sp.get("mq_min") || sp.get("mq_max"));
  const advCount = ADV_KEYS.filter((k) => sp.get(k)).length;
  const chips = activeChips(sp);
  return (
    <div className="sticky top-0 z-30 border-b border-[hsl(var(--listing-border))] bg-card/95 backdrop-blur">
      <div className="container flex items-center gap-2 py-3">
        <div className="flex md:hidden flex-1 gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setSheet("full")}><SlidersHorizontal className="h-4 w-4" />Filtri{chips.length ? ` (${chips.length})` : ""}</Button>
        </div>
        <div className="hidden md:flex flex-1 flex-wrap items-center gap-2">
          <Pill active={tipo.length > 0} label={tipo.length ? (tipo.length === 1 ? TYPES[tipo[0]] : `Tipologia (${tipo.length})`) : "Tipologia"}><TypeChecks sp={sp} set={set} /></Pill>
          <Pill active={hasPrice} label={hasPrice ? priceLabel(sp) : "Prezzo"}><RangeInput sp={sp} set={set} minKey="prezzo_min" maxKey="prezzo_max" steps={PRICE_STEPS} fmt={shortPrice} unit="€" /></Pill>
          <Pill active={hasMq} label={hasMq ? `${sp.get("mq_min") || 0}–${sp.get("mq_max") || "∞"} m²` : "Superficie"}><RangeInput sp={sp} set={set} minKey="mq_min" maxKey="mq_max" steps={SURFACE_STEPS} fmt={(n) => `${n} m²`} unit="m²" /></Pill>
          <Pill active={locali.length > 0} label={locali.length ? `${locali.map((l) => (l === "5" ? "5+" : l)).join(", ")} locali` : "Locali"}><RoomsToggle sp={sp} set={set} /></Pill>
          <button type="button" onClick={() => setSheet("adv")} className={`flex items-center gap-1 rounded-full border px-4 py-2 text-sm font-semibold ${advCount ? "border-primary bg-primary text-primary-foreground" : "border-[hsl(var(--listing-border))] hover:border-primary"}`}>
            <SlidersHorizontal className="h-4 w-4" />Altri filtri{advCount ? ` (${advCount})` : ""}
          </button>
        </div>
        {right}
      </div>
      {chips.length > 0 && (
        <div className="container flex flex-wrap items-center gap-2 pb-3">
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={() => set(removeChip(sp, c.key))} aria-label={`Rimuovi filtro ${c.label}`}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20">
              {c.label}<X className="h-3 w-3" />
            </button>
          ))}
          <button type="button" className="text-xs font-semibold text-secondary underline" onClick={() => set(Object.fromEntries(FILTER_KEYS.filter((k) => k !== "zone").map((k) => [k, null])))}>Rimuovi tutti</button>
        </div>
      )}
      <FilterSheet open={!!sheet} onOpenChange={(o) => !o && setSheet(null)} sp={sp} set={set} city={city} zone={zone} full={sheet === "full"} />
    </div>
  );
};

export default FiltersBar;
