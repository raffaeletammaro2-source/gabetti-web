import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BedDouble, Ruler, Bath, Building2, ChevronLeft, ChevronRight, Mail, CalendarDays, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactDialog from "./ContactDialog";
import FavoriteButton from "./FavoriteButton";
import { Property, formatPrice, propertyUrl, isNew, floorLabel } from "@/lib/properties";

export const PropertyBadges = ({ p }: { p: Property }) => (
  <div className="flex flex-wrap gap-1">
    {isNew(p) && <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">NUOVO</span>}
    {p.is_exclusive && <span className="rounded bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">ESCLUSIVA</span>}
    {p.has_virtual_tour && <span className="rounded bg-background px-2 py-0.5 text-[11px] font-bold text-foreground">VISITA VIRTUALE</span>}
    {p.price_previous && p.price_previous > p.price && <span className="rounded bg-[hsl(var(--success))] px-2 py-0.5 text-[11px] font-bold text-primary-foreground">PREZZO RIBASSATO</span>}
  </div>
);

export const PriceBlock = ({ p, big }: { p: Property; big?: boolean }) => {
  const drop = p.price_previous && p.price_previous > p.price ? Math.round((1 - p.price / p.price_previous) * 100) : 0;
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className={`${big ? "text-3xl" : "text-2xl"} font-extrabold text-primary`}>{formatPrice(p.price)}</span>
      {drop > 0 && (
        <>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(p.price_previous!)}</span>
          <span className="text-sm font-bold text-[hsl(var(--success))]">-{drop}%</span>
        </>
      )}
    </div>
  );
};

export const FeatureRow = ({ p }: { p: Property }) => (
  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary">
    <li className="flex items-center gap-1"><BedDouble className="h-4 w-4" aria-hidden />{p.rooms} locali</li>
    <li className="flex items-center gap-1"><Ruler className="h-4 w-4" aria-hidden />{p.surface_m2} m²</li>
    <li className="flex items-center gap-1"><Bath className="h-4 w-4" aria-hidden />{p.bathrooms} {p.bathrooms === 1 ? "bagno" : "bagni"}</li>
    {p.floor && <li className="flex items-center gap-1"><Building2 className="h-4 w-4" aria-hidden />{floorLabel(p.floor)}</li>}
    {p.has_elevator && <li className="flex items-center gap-1"><ArrowUpDown className="h-4 w-4" aria-hidden />Ascensore</li>}
  </ul>
);

export const PhotoCarousel = ({ images, alt, className = "" }: { images: string[]; alt: string; className?: string }) => {
  const [i, setI] = useState(0);
  const touch = useRef<number | null>(null);
  const n = images.length || 1;
  const go = (e: React.SyntheticEvent, d: number) => { e.preventDefault(); e.stopPropagation(); setI((i + d + n) % n); };
  return (
    <div className={`group relative overflow-hidden bg-muted aspect-[4/3] ${className}`}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(e, dx < 0 ? 1 : -1); touch.current = null; }}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(e, 1); if (e.key === "ArrowLeft") go(e, -1); }}
      tabIndex={0} role="region" aria-roledescription="carosello" aria-label={`Foto di ${alt}`}>
      {images[i] && <img src={images[i]} alt={`${alt} – foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover" width={800} height={600} />}
      {n > 1 && (
        <>
          <button type="button" aria-label="Foto precedente" onClick={(e) => go(e, -1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" aria-label="Foto successiva" onClick={(e) => go(e, 1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-1.5 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"><ChevronRight className="h-5 w-5" /></button>
          <span className="absolute bottom-2 right-2 rounded bg-foreground/75 px-2 py-0.5 text-xs font-semibold text-background">{i + 1}/{n}</span>
        </>
      )}
    </div>
  );
};

const PropertyCard = ({ p }: { p: Property }) => {
  const [dialog, setDialog] = useState<"info" | "visita" | null>(null);
  const open = (t: "info" | "visita") => (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setDialog(t); };
  return (
    <article className="overflow-hidden rounded-xl border border-[hsl(var(--listing-border))] bg-card shadow-sm transition-shadow hover:shadow-lg">
      <Link to={propertyUrl(p)} className="flex flex-col md:flex-row focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <div className="relative md:w-2/5 shrink-0">
          <PhotoCarousel images={p.images} alt={p.title} />
          <div className="absolute left-2 top-2"><PropertyBadges p={p} /></div>
          <FavoriteButton id={p.id} className="absolute right-2 top-2" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <PriceBlock p={p} />
          <h2 className="text-base font-bold leading-snug text-foreground hover:text-primary">{p.title}</h2>
          <FeatureRow p={p} />
          <p className="line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
            <span className="text-sm text-secondary">Rif. <strong>{p.reference_code}</strong></span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={open("info")} className="border-primary text-primary hover:bg-primary/5"><Mail className="h-4 w-4" />Messaggio</Button>
              <Button size="sm" onClick={open("visita")}><CalendarDays className="h-4 w-4" />Prenota visita</Button>
            </div>
          </div>
        </div>
      </Link>
      {dialog && <ContactDialog property={p} type={dialog} open onOpenChange={(o) => !o && setDialog(null)} />}
    </article>
  );
};

export const PropertyCardSkeleton = () => (
  <div className="flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-card">
    <div className="aspect-[4/3] md:w-2/5 animate-pulse bg-muted" />
    <div className="flex-1 space-y-3 p-4">
      <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
      <div className="h-16 animate-pulse rounded bg-muted" />
    </div>
  </div>
);

export default PropertyCard;
