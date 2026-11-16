import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { Property, propertyUrl, shortPrice, formatPrice } from "@/lib/properties";

type Props = { items: Property[]; area: string | null; onSearchArea: (bbox: string | null) => void };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

const MapView = ({ items, area, onSearchArea }: Props) => {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const layer = useRef<L.MarkerClusterGroup | null>(null);
  const [moved, setMoved] = useState(false);
  const fitting = useRef(false);

  useEffect(() => {
    if (!el.current || map.current) return;
    const m = L.map(el.current, { scrollWheelZoom: true }).setView([40.92, 14.2], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 19 }).addTo(m);
    layer.current = L.markerClusterGroup({ showCoverageOnHover: false }).addTo(m);
    m.on("moveend", () => { if (!fitting.current) setMoved(true); });
    map.current = m;
    return () => { m.remove(); map.current = null; };
  }, []);

  useEffect(() => {
    const m = map.current, g = layer.current;
    if (!m || !g) return;
    g.clearLayers();
    items.forEach((p) => {
      if (p.lat == null || p.lng == null) return;
      const icon = L.divIcon({ className: "", html: `<span class="gab-pin">${shortPrice(p.price)}</span>`, iconSize: [64, 28], iconAnchor: [32, 28] });
      const img = p.images[0] ? `<img src="${esc(p.images[0])}" alt="" style="width:100%;height:110px;object-fit:cover;border-radius:6px"/>` : "";
      L.marker([p.lat, p.lng], { icon, title: p.title }).bindPopup(
        `<a href="${propertyUrl(p)}" style="display:block;width:220px;color:inherit;text-decoration:none">${img}<strong style="display:block;margin-top:6px;color:hsl(var(--primary));font-size:16px">${formatPrice(p.price)}</strong><span style="font-size:13px">${esc(p.title)}</span><br/><small>${p.rooms} locali · ${p.surface_m2} m² · Rif. ${esc(p.reference_code || "")}</small></a>`,
      ).addTo(g);
    });
    if (!area && items.length) {
      fitting.current = true;
      m.fitBounds(g.getBounds(), { padding: [30, 30], maxZoom: 15 });
      setTimeout(() => { fitting.current = false; setMoved(false); }, 400);
    }
  }, [items, area]);

  const searchHere = () => {
    const b = map.current!.getBounds();
    onSearchArea([b.getSouth(), b.getWest(), b.getNorth(), b.getEast()].map((n) => n.toFixed(5)).join(","));
    setMoved(false);
  };

  return (
    <div className="relative">
      <div ref={el} className="h-[65vh] min-h-[420px] w-full rounded-xl border border-[hsl(var(--listing-border))] z-0" role="region" aria-label="Mappa degli immobili" />
      <div className="absolute left-1/2 top-3 z-[500] flex -translate-x-1/2 gap-2">
        {moved && <button onClick={searchHere} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-lg">Cerca in quest'area</button>}
        {area && <button onClick={() => onSearchArea(null)} className="rounded-full bg-background px-4 py-2 text-sm font-bold text-foreground shadow-lg">Rimuovi area</button>}
      </div>
    </div>
  );
};
export default MapView;
