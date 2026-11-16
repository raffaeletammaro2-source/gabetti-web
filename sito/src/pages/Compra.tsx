import { Fragment, useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import { Bookmark, ChevronRight, List, Map as MapIcon, SearchX } from "lucide-react";
import { toast } from "sonner";
import { saveSearch } from "@/lib/favorites";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import SearchBar from "@/components/compra/SearchBar";
import FiltersBar from "@/components/compra/Filters";
import PropertyCard, { PropertyCardSkeleton } from "@/components/compra/PropertyCard";
import AcquisitionBanner from "@/components/compra/AcquisitionBanner";
const MapView = lazy(() => import("@/components/compra/MapView"));
import { fetchMapProperties, fetchProperties, fetchZones, list, PAGE_SIZE, SORTS, TYPES, VALUTA_URL } from "@/lib/properties";

const SEO_LINKS = [
  ["ascensore", "ascensore"], ["garage", "garage o box"], ["cantina", "cantina"], ["terrazzo", "terrazzo"], ["giardino", "giardino"],
  ["piscina", "piscina"], ["clima", "aria condizionata"], ["vista_mare", "vista mare"],
];

const Pagination = ({ page, pages, onGo }: { page: number; pages: number; onGo: (p: number) => void }) => {
  if (pages <= 1) return null;
  const nums: (number | "…")[] = [];
  for (let i = 1; i <= pages; i++) if (i === 1 || i === pages || Math.abs(i - page) <= 2) nums.push(i); else if (nums[nums.length - 1] !== "…") nums.push("…");
  const btn = "min-w-[40px] rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-40";
  return (
    <nav aria-label="Paginazione" className="flex items-center justify-center gap-1 py-6">
      <button className={`${btn} border-border`} disabled={page === 1} onClick={() => onGo(page - 1)}>« Precedente</button>
      <span className="px-3 text-sm md:hidden">{page}/{pages}</span>
      {nums.map((n, i) => n === "…" ? <span key={i} className="hidden md:inline px-2">…</span> : (
        <button key={i} aria-current={n === page ? "page" : undefined} onClick={() => onGo(n)}
          className={`${btn} hidden md:inline-block ${n === page ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"}`}>{n}</button>
      ))}
      <button className={`${btn} border-border`} disabled={page === pages} onClick={() => onGo(page + 1)}>Successiva »</button>
    </nav>
  );
};

const Compra = () => {
  const { citta, zona } = useParams();
  const [sp, setSp] = useSearchParams();
  const listTop = useRef<HTMLDivElement>(null);
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: fetchZones, staleTime: 3600000 });
  const { data, isLoading } = useQuery({
    queryKey: ["properties", citta, zona, sp.toString()],
    queryFn: () => fetchProperties(sp, citta, zona),
    placeholderData: keepPreviousData,
  });
  const isMap = sp.get("vista") === "mappa";
  const { data: mapItems = [] } = useQuery({
    queryKey: ["properties-map", citta, zona, sp.toString()],
    queryFn: () => fetchMapProperties(sp, citta, zona),
    enabled: isMap,
    placeholderData: keepPreviousData,
  });

  const set = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("pag" in patch)) next.delete("pag");
    setSp(next);
  };

  const cityZones = zones.filter((z) => z.city_slug === citta);
  const cityName = cityZones[0]?.city;
  const zoneName = cityZones.find((z) => z.slug === zona)?.name;
  const tipo = list(sp, "tipo");
  const what = tipo.length === 1 ? `${TYPES[tipo[0]]}${tipo[0] === "villa" || tipo[0] === "nuova_costruzione" ? "" : "i"}`.replace("Appartamentoi", "Appartamenti").replace("Atticoi", "Attici").replace("Loft" + "i", "Loft") : "Case";
  const place = zoneName ? `${zoneName}, ${cityName}` : cityName || "Napoli Nord";
  const h1 = `${tipo.length === 1 && tipo[0] === "villa" ? "Ville" : what} in vendita a ${place}`;
  const total = data?.total ?? 0;
  const page = data?.page ?? 1;
  const pages = Math.ceil(total / PAGE_SIZE);
  const base = citta ? `/compra/${citta}` : "/compra";

  useEffect(() => { if (sp.get("pag")) listTop.current?.scrollIntoView({ behavior: "smooth" }); }, [sp]); // eslint-disable-line

  const items = data?.items ?? [];

  return (
    <div className="min-h-screen bg-[hsl(var(--listing-bg))]">
      <SeoHead title={`Case in vendita a ${place} – ${total} annunci | Gabetti`}
        description={`${total} immobili in vendita a ${place}: appartamenti, ville e nuove costruzioni selezionati dalle agenzie Gabetti. Filtra per prezzo, locali e caratteristiche.`}
        canonical={`${base}${zona ? `/${zona}` : ""}`} />
      <Header />
      <section className="bg-card border-b border-[hsl(var(--listing-border))]">
        <div className="container py-5"><SearchBar initialCity={citta} initialZones={zona ? [zona] : list(sp, "zone")} initialType={tipo.length === 1 ? tipo[0] : ""} /></div>
      </section>

      <nav aria-label="Breadcrumb" className="container flex flex-wrap items-center gap-1 py-3 text-sm text-secondary">
        <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="h-4 w-4" />
        <Link to="/compra" className="hover:text-primary">Compra</Link>
        {cityName && (<><ChevronRight className="h-4 w-4" /><Link to={`/compra/${citta}`} className="hover:text-primary">{cityName}</Link><ChevronRight className="h-4 w-4" />
          <label htmlFor="zone-pick" className="sr-only">Scegli la zona</label>
          <select id="zone-pick" value={zona || ""} onChange={(e) => (window.location.href = e.target.value ? `/compra/${citta}/${e.target.value}` : `/compra/${citta}`)}
            className="rounded border border-border bg-card px-2 py-1 text-sm">
            <option value="">Scegli la zona</option>
            {cityZones.map((z) => <option key={z.id} value={z.slug}>{z.name}</option>)}
          </select></>)}
      </nav>

      <FiltersBar sp={sp} set={set} city={citta} zone={zona} />

      <main className="container py-6" ref={listTop}>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">{h1}</h1>
            <p className="text-secondary">{isLoading ? "Caricamento…" : `${total} risultati`}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-border bg-card p-0.5" role="group" aria-label="Tipo di vista">
            <button aria-pressed={!isMap} onClick={() => set({ vista: null, pag: null })} className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold ${!isMap ? "bg-primary text-primary-foreground" : "text-foreground"}`}><List className="h-4 w-4" />Lista</button>
            <button aria-pressed={isMap} onClick={() => set({ vista: "mappa", pag: null })} className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-semibold ${isMap ? "bg-primary text-primary-foreground" : "text-foreground"}`}><MapIcon className="h-4 w-4" />Mappa</button>
          </div>
          <button onClick={() => { const q = new URLSearchParams(sp); q.delete("pag"); q.delete("vista"); saveSearch(h1, `${base}${zona ? `/${zona}` : ""}${q.toString() ? `?${q}` : ""}`); toast.success("Ricerca salvata", { description: "La trovi nella pagina Preferiti." }); }}
            className="flex items-center gap-1 rounded-lg border border-primary bg-card px-3 py-2 text-sm font-semibold text-primary"><Bookmark className="h-4 w-4" />Salva ricerca</button>
          <label className="flex items-center gap-2 text-sm font-semibold text-secondary">Ordina per
            <select value={sp.get("ordine") || "rilevanza"} onChange={(e) => set({ ordine: e.target.value === "rilevanza" ? null : e.target.value })}
              className="rounded-lg border border-border bg-card px-3 py-2 text-foreground">
              {Object.entries(SORTS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
          </label>
          </div>
        </div>
        {isMap && (
          <div className="mb-6">
            <Suspense fallback={<div className="h-[65vh] animate-pulse rounded-xl bg-muted" />}>
              <MapView items={mapItems} area={sp.get("area")} onSearchArea={(a) => set({ area: a })} />
            </Suspense>
            <p className="mt-2 text-sm text-muted-foreground">{mapItems.length} immobili sulla mappa. Sposta la mappa e premi "Cerca in quest'area" per restringere la ricerca.</p>
          </div>
        )}

        <div className="space-y-4">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          {!isLoading && items.length === 0 && (
            <div className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-10 text-center">
              <SearchX className="mx-auto h-16 w-16 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl font-bold">Nessun immobile corrisponde alla tua ricerca</h2>
              <p className="mt-2 text-muted-foreground">Prova a rimuovere l'ultimo filtro o ad allargare la zona di ricerca.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link to="/compra" className="rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground">Vedi tutti gli immobili</Link>
                <a href={VALUTA_URL} className="rounded-lg border border-primary px-5 py-3 font-bold text-primary">Valuta la tua casa</a>
              </div>
            </div>
          )}
          {items.map((p, i) => (
            <Fragment key={p.id}>
              <PropertyCard p={p} />
              {i === 4 && <AcquisitionBanner title="Hai una casa da vendere prima di comprare?" text="Scopri gratis quanto vale il tuo immobile. Valutazione professionale, senza impegno." />}
              {i === 14 && <AcquisitionBanner title="Hai ereditato un immobile?" text="Ti aiutiamo a venderlo, burocrazia compresa. Parti da una valutazione gratuita." />}
            </Fragment>
          ))}
        </div>

        <Pagination page={page} pages={pages} onGo={(p) => set({ pag: p > 1 ? String(p) : null })} />

        <section className="mt-10 grid gap-8 rounded-xl border border-[hsl(var(--listing-border))] bg-card p-6 md:grid-cols-3">
          <div>
            <h2 className="mb-3 font-bold">Case in vendita a {cityName || "Napoli Nord"} con:</h2>
            <ul className="space-y-1 text-sm">
              {SEO_LINKS.map(([k, l]) => <li key={k}><Link to={`${base}?${k}=1`} className="text-secondary hover:text-primary">Case con {l}</Link></li>)}
              <li><Link to={`${base}?piano=terra`} className="text-secondary hover:text-primary">Case al piano terra</Link></li>
              <li><Link to={`${base}?piano=ultimo`} className="text-secondary hover:text-primary">Case all'ultimo piano</Link></li>
              <li><Link to={`${base}?riscaldamento=autonomo`} className="text-secondary hover:text-primary">Case con riscaldamento autonomo</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-bold">Cerca per zona</h2>
            <ul className="space-y-1 text-sm">
              {(citta ? cityZones : zones).map((z) => <li key={z.id}><Link to={`/compra/${z.city_slug}/${z.slug}`} className="text-secondary hover:text-primary">{z.name}{!citta && `, ${z.city}`}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-bold">Ricerche correlate</h2>
            <ul className="space-y-1 text-sm">
              <li><Link to={`${base}?stato=da_ristrutturare`} className="text-secondary hover:text-primary">Case da ristrutturare</Link></li>
              <li><Link to={`${base}?prezzo_min=750000`} className="text-secondary hover:text-primary">Case di lusso</Link></li>
              <li><Link to={`${base}?tipo=nuova_costruzione`} className="text-secondary hover:text-primary">Nuove costruzioni</Link></li>
              <li><Link to={`${base}?prezzo_max=150000`} className="text-secondary hover:text-primary">Case economiche</Link></li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-3 text-sm text-muted-foreground">
            <h2 className="text-base font-bold text-foreground">Il mercato immobiliare a {cityName || "Napoli Nord"}</h2>
            <p>L'area a nord di Napoli – Marano, Mugnano, Villaricca, Qualiano, Frattamaggiore e Giugliano – offre un mercato immobiliare dinamico, con prezzi più accessibili rispetto al capoluogo e ottimi collegamenti verso Napoli.</p>
            <p>Le famiglie cercano soprattutto trilocali e quadrilocali con spazi esterni, mentre cresce la domanda di nuove costruzioni in classe energetica elevata. I consulenti Gabetti di zona selezionano gli immobili e ti accompagnano dalla visita al rogito.</p>
            <p>Hai già una casa da vendere? Parti da una <a href={VALUTA_URL} className="text-primary underline">valutazione gratuita</a> basata sui prezzi reali di vendita della tua zona.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Compra;
