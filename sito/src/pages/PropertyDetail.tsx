import FavoriteButton from "@/components/compra/FavoriteButton";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Share2, Link2, Phone, Mail, X } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import { supabase } from "@/integrations/supabase/client";
import { ContactForm } from "@/components/compra/ContactDialog";
import PropertyCard, { FeatureRow, PriceBlock, PropertyBadges } from "@/components/compra/PropertyCard";
import AcquisitionBanner from "@/components/compra/AcquisitionBanner";
import { Property, CONDITIONS, ENERGY, TYPES, formatNum, formatPrice, floorLabel, propertyUrl } from "@/lib/properties";
import { WhatsAppIcon } from "@/components/SocialIcons";
import { trackPhoneClick, trackWhatsAppClick } from "@/lib/tracking";

const ENERGY_COLORS = ["142 70% 30%", "142 65% 36%", "120 55% 40%", "100 55% 42%", "80 60% 42%", "55 85% 45%", "40 90% 50%", "25 90% 50%", "10 80% 50%", "0 75% 45%"];

const Mortgage = ({ price }: { price: number }) => {
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(3.2);
  const loan = price * (1 - down / 100);
  const r = rate / 100 / 12, n = years * 12;
  const monthly = r ? (loan * r) / (1 - Math.pow(1 + r, -n)) : loan / n;
  return (
    <section className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
      <h2 className="mb-4 text-xl font-bold">Calcola la rata del mutuo</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold">Anticipo: {down}% ({formatPrice(price * down / 100)})
          <input type="range" min={0} max={80} step={5} value={down} onChange={(e) => setDown(+e.target.value)} className="w-full accent-[hsl(var(--primary))]" /></label>
        <label className="text-sm font-semibold">Durata: {years} anni
          <input type="range" min={10} max={30} step={5} value={years} onChange={(e) => setYears(+e.target.value)} className="w-full accent-[hsl(var(--primary))]" /></label>
        <label className="text-sm font-semibold">Tasso annuo (%)
          <input type="number" step={0.1} min={0} max={15} value={rate} onChange={(e) => setRate(Math.max(0, +e.target.value))} className="mt-1 w-full rounded-lg border border-input px-3 py-2" /></label>
      </div>
      <p className="mt-4 text-secondary">Importo mutuo {formatPrice(loan)} · Rata mensile stimata <strong className="text-2xl text-primary">{formatPrice(Math.round(monthly))}</strong></p>
    </section>
  );
};

const PropertyDetail = () => {
  const { slugid = "" } = useParams();
  const id = slugid.slice(-36);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [tab, setTab] = useState<"foto" | "planimetria" | "tour" | "mappa">("foto");
  const [more, setMore] = useState(false);

  const { data: p, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => (await supabase.from("properties").select("*").eq("id", id).eq("is_published", true).maybeSingle()).data as Property | null,
  });
  const { data: agency } = useQuery({
    enabled: !!p?.agency_id,
    queryKey: ["agency", p?.agency_id],
    queryFn: async () => (await supabase.from("agencies").select("*").eq("id", p!.agency_id!).maybeSingle()).data,
  });
  const { data: similar = [] } = useQuery({
    enabled: !!p,
    queryKey: ["similar", id],
    queryFn: async () => (await supabase.from("properties").select("*").eq("is_published", true).eq("city_slug", p!.city_slug).neq("id", p!.id)
      .gte("price", Math.round(p!.price * 0.8)).lte("price", Math.round(p!.price * 1.2)).limit(6)).data as Property[],
  });

  const jsonLd = useMemo(() => p && ({
    "@context": "https://schema.org", "@type": "RealEstateListing", name: p.title, description: p.description, url: `https://gabetti-adg.it${propertyUrl(p)}`,
    image: p.images, datePosted: p.created_at,
    offers: { "@type": "Offer", price: p.price, priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    about: { "@type": "Residence", address: { "@type": "PostalAddress", streetAddress: p.address, addressLocality: p.city, addressRegion: p.province, addressCountry: "IT" },
      floorSize: { "@type": "QuantitativeValue", value: p.surface_m2, unitCode: "MTK" }, numberOfRooms: p.rooms,
      geo: p.lat ? { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng } : undefined },
  }), [p]);

  if (isLoading) return (<><Header /><div className="container py-10"><div className="h-96 animate-pulse rounded-xl bg-muted" /></div></>);
  if (!p) return (<><Header /><div className="container py-20 text-center"><h1 className="text-2xl font-bold">Annuncio non disponibile</h1><Link to="/compra" className="mt-4 inline-block text-primary underline">Torna alla ricerca</Link></div><Footer /></>);

  const url = typeof window !== "undefined" ? window.location.href : "";
  const yes = (b: boolean) => (b ? "Sì" : "No");
  const rows: [string, string | number | null][] = [
    ["Tipologia", TYPES[p.property_type]], ["Superficie", `${p.surface_m2} m²`], ["Locali", p.rooms], ["Bagni", p.bathrooms],
    ["Piano", floorLabel(p.floor)], ["Ascensore", yes(p.has_elevator)], ["Stato", p.condition ? CONDITIONS[p.condition] : null],
    ["Riscaldamento", p.heating], ["Climatizzazione", yes(p.has_air_conditioning)], ["Box / garage", yes(p.has_garage)],
    ["Cantina", yes(p.has_cellar)], ["Terrazzo", yes(p.has_terrace)], ["Giardino", yes(p.has_garden)], ["Arredato", yes(p.is_furnished)],
  ];
  const bbox = p.lat && p.lng ? `${p.lng - 0.01},${p.lat - 0.006},${p.lng + 0.01},${p.lat + 0.006}` : "";
  const mapSrc = bbox && `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${p.lat},${p.lng}`;

  return (
    <div className="min-h-screen bg-[hsl(var(--listing-bg))] pb-20 lg:pb-0">
      <SeoHead title={`${p.title} – ${formatPrice(p.price)} | Gabetti`} description={(p.description || "").slice(0, 155)} canonical={propertyUrl(p)} ogImage={p.images[0]} jsonLd={jsonLd as Record<string, unknown>} />
      <Header />
      <nav aria-label="Breadcrumb" className="container flex flex-wrap items-center gap-1 py-3 text-sm text-secondary">
        <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="h-4 w-4" />
        <Link to="/compra" className="hover:text-primary">Compra</Link><ChevronRight className="h-4 w-4" />
        <Link to={`/compra/${p.city_slug}`} className="hover:text-primary">{p.city}</Link>
        {p.zone_slug && (<><ChevronRight className="h-4 w-4" /><Link to={`/compra/${p.city_slug}/${p.zone_slug}`} className="hover:text-primary">{p.zone}</Link></>)}
      </nav>

      <div className="container">
        <div className="mb-3 flex gap-2 text-sm font-semibold" role="tablist">
          {([["foto", "Foto"], ["planimetria", "Planimetria"], ["tour", "Visita virtuale"], ["mappa", "Mappa"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-1.5 ${tab === k ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{l}</button>
          ))}
        </div>
        {tab === "foto" && (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl h-[260px] md:h-[440px]">
            {p.images.slice(0, 5).map((src, i) => (
              <button key={i} onClick={() => setLightbox(i)} className={`relative overflow-hidden ${i === 0 ? "col-span-4 row-span-2 md:col-span-2" : "hidden md:block"}`} aria-label={`Apri foto ${i + 1}`}>
                <img src={src} alt={`${p.title} – foto ${i + 1}`} loading={i ? "lazy" : "eager"} className="h-full w-full object-cover transition-transform hover:scale-105" />
                {i === 0 && <div className="absolute left-3 top-3"><PropertyBadges p={p} /></div>}
              </button>
            ))}
          </div>
        )}
        {tab === "planimetria" && <div className="flex h-[300px] items-center justify-center rounded-xl bg-card">{p.floorplan_url ? <img src={p.floorplan_url} alt="Planimetria" className="max-h-full" /> : <p className="text-muted-foreground">Planimetria disponibile su richiesta</p>}</div>}
        {tab === "tour" && <div className="flex h-[300px] md:h-[440px] items-center justify-center rounded-xl bg-card overflow-hidden">{p.virtual_tour_url ? <iframe src={p.virtual_tour_url} title="Visita virtuale" className="h-full w-full" /> : <p className="text-muted-foreground">Visita virtuale non disponibile per questo immobile</p>}</div>}
        {tab === "mappa" && mapSrc && <iframe title="Mappa" src={mapSrc} className="h-[300px] md:h-[440px] w-full rounded-xl border-0" loading="lazy" />}
      </div>

      <div className="container grid gap-6 py-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <header className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5 space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><PriceBlock p={p} big /><p className="text-sm text-secondary">{formatNum(Math.round(p.price / p.surface_m2))} €/m²</p></div>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(url); toast.success("Link copiato"); }} className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary" aria-label="Copia link"><Link2 className="h-4 w-4" />Copia link</button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`${p.title} ${url}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:border-primary" aria-label="Condividi su WhatsApp"><Share2 className="h-4 w-4" /><WhatsAppIcon className="h-4 w-4" /></a>
              </div>
            </div>
            <div className="flex items-start justify-between gap-3"><h1 className="text-2xl font-extrabold">{p.title}</h1><FavoriteButton id={p.id} className="shrink-0 border border-border" /></div>
            {p.reference_code && <p className="text-sm text-secondary">Rif. <strong>{p.reference_code}</strong></p>}
            <p className="text-secondary">{p.address}, {p.zone}, {p.city} ({p.province})</p>
            <FeatureRow p={p} />
          </header>

          <section className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
            <h2 className="mb-2 text-xl font-bold">Descrizione</h2>
            <p className={`whitespace-pre-line text-muted-foreground ${more ? "" : "line-clamp-4"}`}>{p.description}</p>
            <button onClick={() => setMore(!more)} className="mt-2 text-sm font-bold text-primary">{more ? "Mostra meno" : "Leggi tutto"}</button>
          </section>

          <section className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
            <h2 className="mb-3 text-xl font-bold">Caratteristiche</h2>
            <dl className="grid sm:grid-cols-2 gap-x-8">
              {rows.filter(([, v]) => v !== null && v !== undefined).map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-border py-2 text-sm"><dt className="text-secondary">{k}</dt><dd className="font-semibold capitalize">{v}</dd></div>
              ))}
            </dl>
          </section>

          {p.energy_class && (
            <section className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
              <h2 className="mb-3 text-xl font-bold">Efficienza energetica</h2>
              <div className="flex gap-1" role="img" aria-label={`Classe energetica ${p.energy_class}`}>
                {ENERGY.map((e, i) => (
                  <div key={e} style={{ backgroundColor: `hsl(${ENERGY_COLORS[i]})` }}
                    className={`flex-1 rounded py-2 text-center text-xs font-bold text-primary-foreground transition-transform ${e === p.energy_class ? "scale-y-125 ring-2 ring-foreground" : "opacity-50"}`}>{e}</div>
                ))}
              </div>
            </section>
          )}

          {mapSrc && (
            <section className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
              <h2 className="mb-3 text-xl font-bold">Posizione</h2>
              <iframe title="Mappa posizione" src={mapSrc} className="h-72 w-full rounded-lg border-0" loading="lazy" />
            </section>
          )}

          <Mortgage price={p.price} />
          <AcquisitionBanner title="Devi vendere casa prima di acquistare questa?" text="Valutala gratis: valutazione professionale, senza impegno." campaign="compra_dettaglio" />
        </div>

        <aside id="contatta" className="lg:sticky lg:top-4 h-fit rounded-xl border border-[hsl(var(--listing-border))] bg-card p-5">
          <p className="text-sm text-secondary">Annuncio gestito da</p>
          <p className="mb-1 text-lg font-bold">{agency?.name || p.agent_name}</p>
          {(agency?.phone || p.agent_phone) && <a href={`tel:${(agency?.phone || p.agent_phone)!.replace(/\s/g, "")}`} onClick={(e) => trackPhoneClick(e.currentTarget.href)} className="mb-2 flex items-center gap-1 text-sm font-semibold text-primary"><Phone className="h-4 w-4" />{agency?.phone || p.agent_phone}</a>}
          {agency && (
            <div className="mb-4 flex flex-wrap gap-3 text-sm font-semibold text-primary">
              {agency.whatsapp_url && <a href={agency.whatsapp_url} onClick={() => trackWhatsAppClick(agency.whatsapp_url!)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
              {agency.instagram_url && <a href={agency.instagram_url} target="_blank" rel="noopener noreferrer">Instagram</a>}
              {agency.facebook_url && <a href={agency.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}
              {agency.google_url && <a href={agency.google_url} target="_blank" rel="noopener noreferrer">Google</a>}
            </div>
          )}
          <ContactForm property={p} />
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="container pb-10">
          <h2 className="mb-4 text-2xl font-bold">Immobili simili</h2>
          <div className="flex snap-x gap-4 overflow-x-auto pb-2">
            {similar.map((s) => <div key={s.id} className="w-[320px] md:w-[620px] shrink-0 snap-start"><PropertyCard p={s} /></div>)}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-border bg-card p-3 lg:hidden">
        {p.agent_phone && <a href={`tel:${p.agent_phone.replace(/\s/g, "")}`} onClick={(e) => trackPhoneClick(e.currentTarget.href)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-primary py-3 font-bold text-primary"><Phone className="h-4 w-4" />Chiama</a>}
        <a href="#contatta" className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground"><Mail className="h-4 w-4" />Scrivi</a>
      </div>

      {lightbox !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/95" role="dialog" aria-label="Galleria foto"
          onKeyDown={(e) => { if (e.key === "Escape") setLightbox(null); if (e.key === "ArrowRight") setLightbox((lightbox + 1) % p.images.length); if (e.key === "ArrowLeft") setLightbox((lightbox - 1 + p.images.length) % p.images.length); }} tabIndex={-1} ref={(el) => el?.focus()}>
          <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 text-background" aria-label="Chiudi"><X className="h-8 w-8" /></button>
          <button onClick={() => setLightbox((lightbox - 1 + p.images.length) % p.images.length)} className="absolute left-4 text-4xl text-background" aria-label="Foto precedente">‹</button>
          <img src={p.images[lightbox]} alt={`${p.title} – foto ${lightbox + 1}`} className="max-h-[85vh] max-w-[90vw] object-contain" />
          <button onClick={() => setLightbox((lightbox + 1) % p.images.length)} className="absolute right-4 text-4xl text-background" aria-label="Foto successiva">›</button>
          <span className="absolute bottom-4 text-background">{lightbox + 1}/{p.images.length}</span>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
