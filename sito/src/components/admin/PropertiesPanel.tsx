import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ExternalLink, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONDITIONS, ENERGY, FEATURES, Property, TYPES, fetchZones, formatPrice, propertyUrl } from "@/lib/properties";

type Draft = Partial<Property>;
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
const sel = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

const PropertiesPanel = () => {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<Draft | null>(null);
  const [uploading, setUploading] = useState(false);
  const { data: rows = [] } = useQuery({ queryKey: ["admin-properties"], queryFn: async () => ((await supabase.from("properties").select("*").order("created_at", { ascending: false })).data || []) as Property[] });
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: fetchZones });
  const { data: agencies = [] } = useQuery({ queryKey: ["admin-agencies"], queryFn: async () => (await supabase.from("agencies").select("*").order("name")).data || [] });
  const cities = [...new Map(zones.map((z) => [z.city_slug, z.city])).entries()];
  const set = (patch: Draft) => setEdit((e) => ({ ...e, ...patch }));
  const autoAgency = agencies.find((a) => edit?.city_slug && a.city_slugs.includes(edit.city_slug));

  const filtered = rows.filter((r) => !q || `${r.reference_code} ${r.title} ${r.city}`.toLowerCase().includes(q.toLowerCase()));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/") || f.size > 10 * 1024 * 1024) { toast.error(`${f.name}: solo immagini fino a 10 MB`); continue; }
      const path = `${crypto.randomUUID()}.${f.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("property-images").upload(path, f, { contentType: f.type });
      if (error) { toast.error(error.message); continue; }
      const { data } = await supabase.storage.from("property-images").createSignedUrl(path, TEN_YEARS);
      if (data) urls.push(data.signedUrl);
    }
    set({ images: [...(edit?.images || []), ...urls] });
    setUploading(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = edit!;
    const city = cities.find(([s]) => s === d.city_slug);
    const zone = zones.find((z) => z.slug === d.zone_slug && z.city_slug === d.city_slug);
    if (!d.title || !city || !d.price || !d.surface_m2 || !d.rooms) return toast.error("Compila titolo, comune, prezzo, superficie e locali");
    const row = { ...d, city: city[1], zone: zone?.name ?? null, zone_slug: zone?.slug ?? null, slug: slugify(d.title), images: d.images || [] };
    delete (row as any).created_at; delete (row as any).reference_code;
    const { error } = d.id ? await supabase.from("properties").update(row).eq("id", d.id) : await supabase.from("properties").insert(row as any);
    if (error) return toast.error("Salvataggio non riuscito", { description: error.message });
    toast.success("Annuncio salvato");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin-properties"] });
    qc.invalidateQueries({ queryKey: ["properties"] });
  };

  const remove = async (p: Property) => {
    if (!confirm(`Eliminare definitivamente l'annuncio ${p.reference_code}?`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-properties"] });
  };

  const num = (k: keyof Property, l: string, req = false) => (
    <div><Label htmlFor={`p-${k}`}>{l}{req && " *"}</Label>
      <Input id={`p-${k}`} type="number" min={0} required={req} value={(edit?.[k] as number) ?? ""} onChange={(e) => set({ [k]: e.target.value === "" ? null : Number(e.target.value) } as Draft)} /></div>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Annunci ({rows.length})</h2>
        <div className="flex gap-2">
          <Input placeholder="Cerca per codice, titolo, comune" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" aria-label="Cerca annunci" />
          <Button onClick={() => setEdit({ property_type: "appartamento", contract: "vendita", bathrooms: 1, is_published: true, images: [], agency_id: null })}><Plus className="h-4 w-4" />Nuovo annuncio</Button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Rif.</th><th className="p-3">Annuncio</th><th className="p-3">Prezzo</th><th className="p-3">Agenzia</th><th className="p-3">Stato</th><th className="p-3" /></tr></thead>
          <tbody>{filtered.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="p-3 font-semibold whitespace-nowrap">{p.reference_code}</td>
              <td className="p-3">{p.title}<div className="text-xs text-muted-foreground">{p.city}{p.zone && ` · ${p.zone}`}</div></td>
              <td className="p-3 whitespace-nowrap">{formatPrice(p.price)}</td>
              <td className="p-3">{agencies.find((a) => a.id === p.agency_id)?.name || "—"}</td>
              <td className="p-3">{p.is_published ? <span className="text-[hsl(var(--success))] font-semibold">Pubblicato</span> : <span className="text-muted-foreground">Bozza</span>}</td>
              <td className="p-3"><div className="flex justify-end gap-1">
                <Button asChild size="icon" variant="ghost" aria-label="Vedi"><Link to={propertyUrl(p)} target="_blank"><ExternalLink className="h-4 w-4" /></Link></Button>
                <Button size="icon" variant="ghost" aria-label={`Modifica ${p.reference_code}`} onClick={() => setEdit(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" aria-label={`Elimina ${p.reference_code}`} onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
              </div></td>
            </tr>))}</tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? `Modifica annuncio ${edit.reference_code}` : "Nuovo annuncio"}</DialogTitle></DialogHeader>
          {!edit?.id && <p className="text-sm text-muted-foreground">Il codice di riferimento viene assegnato automaticamente al salvataggio.</p>}
          {edit && (
            <form onSubmit={save} className="space-y-5">
              <div><Label htmlFor="p-title">Titolo *</Label><Input id="p-title" required value={edit.title || ""} onChange={(e) => set({ title: e.target.value })} /></div>
              <div className="grid gap-3 md:grid-cols-3">
                <div><Label htmlFor="p-type">Tipologia</Label><select id="p-type" className={sel} value={edit.property_type} onChange={(e) => set({ property_type: e.target.value })}>{Object.entries(TYPES).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
                {num("price", "Prezzo €", true)}{num("price_previous", "Prezzo precedente €")}
                {num("surface_m2", "Superficie m²", true)}{num("rooms", "Locali", true)}{num("bathrooms", "Bagni", true)}
                <div><Label htmlFor="p-floor">Piano</Label><Input id="p-floor" placeholder="terra, 1, 2, ultimo…" value={edit.floor || ""} onChange={(e) => set({ floor: e.target.value || null })} /></div>
                {num("total_floors", "Piani totali")}
                <div><Label htmlFor="p-cond">Stato</Label><select id="p-cond" className={sel} value={edit.condition || ""} onChange={(e) => set({ condition: e.target.value || null })}><option value="">—</option>{Object.entries(CONDITIONS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></div>
                <div><Label htmlFor="p-heat">Riscaldamento</Label><select id="p-heat" className={sel} value={edit.heating || ""} onChange={(e) => set({ heating: e.target.value || null })}><option value="">—</option><option value="autonomo">Autonomo</option><option value="centralizzato">Centralizzato</option></select></div>
                <div><Label htmlFor="p-ec">Classe energetica</Label><select id="p-ec" className={sel} value={edit.energy_class || ""} onChange={(e) => set({ energy_class: e.target.value || null })}><option value="">—</option>{ENERGY.map((k) => <option key={k}>{k}</option>)}</select></div>
              </div>

              <fieldset className="grid gap-3 md:grid-cols-3">
                <legend className="mb-2 font-semibold">Posizione</legend>
                <div><Label htmlFor="p-city">Comune *</Label><select id="p-city" required className={sel} value={edit.city_slug || ""} onChange={(e) => set({ city_slug: e.target.value, zone_slug: null })}><option value="">Scegli</option>{cities.map(([s, n]) => <option key={s} value={s}>{n}</option>)}</select></div>
                <div><Label htmlFor="p-zone">Zona</Label><select id="p-zone" className={sel} value={edit.zone_slug || ""} onChange={(e) => set({ zone_slug: e.target.value || null })}><option value="">—</option>{zones.filter((z) => z.city_slug === edit.city_slug).map((z) => <option key={z.id} value={z.slug}>{z.name}</option>)}</select></div>
                <div><Label htmlFor="p-addr">Indirizzo</Label><Input id="p-addr" value={edit.address || ""} onChange={(e) => set({ address: e.target.value || null })} /></div>
                <div><Label htmlFor="p-lat">Latitudine (mappa)</Label><Input id="p-lat" type="number" step="any" value={edit.lat ?? ""} onChange={(e) => set({ lat: e.target.value === "" ? null : Number(e.target.value) })} /></div>
                <div><Label htmlFor="p-lng">Longitudine (mappa)</Label><Input id="p-lng" type="number" step="any" value={edit.lng ?? ""} onChange={(e) => set({ lng: e.target.value === "" ? null : Number(e.target.value) })} /></div>
              </fieldset>

              <div className="rounded-lg border border-border p-3">
                <Label htmlFor="p-agency" className="font-semibold">Annuncio gestito da</Label>
                <select id="p-agency" className={`${sel} mt-1`} value={edit.agency_id || ""} onChange={(e) => set({ agency_id: e.target.value || null })}>
                  <option value="">Automatica in base al comune{autoAgency ? ` (${autoAgency.name})` : ""}</option>
                  {agencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>

              <fieldset><legend className="mb-2 font-semibold">Caratteristiche</legend>
                <div className="flex flex-wrap gap-2">
                  {[...FEATURES, { key: "is_exclusive" as const, label: "Esclusiva" }, { key: "is_published" as const, label: "Pubblicato sul sito" }].map((f) => (
                    <label key={f.key} className="flex items-center gap-1 rounded border border-border px-2 py-1 text-sm">
                      <input type="checkbox" checked={!!edit[f.key]} onChange={(e) => set({ [f.key]: e.target.checked } as Draft)} />{f.label}</label>
                  ))}
                </div></fieldset>

              <div><Label htmlFor="p-desc">Descrizione</Label><Textarea id="p-desc" rows={6} value={edit.description || ""} onChange={(e) => set({ description: e.target.value })} /></div>
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label htmlFor="p-tour">Link visita virtuale</Label><Input id="p-tour" type="url" value={edit.virtual_tour_url || ""} onChange={(e) => set({ virtual_tour_url: e.target.value || null, has_virtual_tour: !!e.target.value })} /></div>
                <div><Label htmlFor="p-plan">Link planimetria</Label><Input id="p-plan" type="url" value={edit.floorplan_url || ""} onChange={(e) => set({ floorplan_url: e.target.value || null })} /></div>
              </div>

              <div>
                <p className="mb-2 font-semibold">Foto ({edit.images?.length || 0}) – la prima è la copertina</p>
                <div className="flex flex-wrap gap-2">
                  {(edit.images || []).map((src, i) => (
                    <div key={src + i} className="relative h-20 w-28 overflow-hidden rounded border border-border">
                      <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                      <button type="button" aria-label={`Rimuovi foto ${i + 1}`} onClick={() => set({ images: edit.images!.filter((_, j) => j !== i) })} className="absolute right-1 top-1 rounded-full bg-background/90 p-0.5"><X className="h-3 w-3" /></button>
                      {i > 0 && <button type="button" onClick={() => { const im = [...edit.images!]; [im[0], im[i]] = [im[i], im[0]]; set({ images: im }); }} className="absolute bottom-1 left-1 rounded bg-background/90 px-1 text-[10px] font-semibold">Copertina</button>}
                    </div>
                  ))}
                  <label className="flex h-20 w-28 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground hover:border-primary">
                    <ImagePlus className="h-5 w-5" />{uploading ? "Caricamento…" : "Aggiungi foto"}
                    <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} disabled={uploading} />
                  </label>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>Salva annuncio</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default PropertiesPanel;
