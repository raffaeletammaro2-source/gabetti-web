import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchZones } from "@/lib/properties";

type Agency = Tables<"agencies">;
const FIELDS: [keyof Agency, string, string][] = [
  ["name", "Nome agenzia *", "text"], ["address", "Indirizzo", "text"], ["phone", "Telefono", "tel"], ["email", "Email", "email"],
  ["whatsapp_url", "Link WhatsApp", "url"], ["instagram_url", "Link Instagram", "url"], ["facebook_url", "Link Facebook", "url"],
  ["google_url", "Link Google (scheda/recensioni)", "url"], ["website_url", "Sito web", "url"],
];

const AgenciesPanel = () => {
  const qc = useQueryClient();
  const { data: agencies = [] } = useQuery({ queryKey: ["admin-agencies"], queryFn: async () => (await supabase.from("agencies").select("*").order("name")).data || [] });
  const { data: zones = [] } = useQuery({ queryKey: ["zones"], queryFn: fetchZones });
  const cities = [...new Map(zones.map((z) => [z.city_slug, z.city])).entries()];
  const [edit, setEdit] = useState<Partial<Agency> | null>(null);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit?.name?.trim()) return;
    const row = { ...edit, name: edit.name.trim(), city_slugs: edit.city_slugs || [] };
    const { error } = edit.id
      ? await supabase.from("agencies").update(row).eq("id", edit.id)
      : await supabase.from("agencies").insert(row as Agency);
    if (error) return toast.error("Salvataggio non riuscito", { description: error.message });
    toast.success("Agenzia salvata");
    setEdit(null);
    qc.invalidateQueries({ queryKey: ["admin-agencies"] });
  };
  const remove = async (a: Agency) => {
    if (!confirm(`Eliminare ${a.name}? Gli annunci collegati resteranno senza agenzia.`)) return;
    const { error } = await supabase.from("agencies").delete().eq("id", a.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-agencies"] });
  };
  const toggleCity = (slug: string) => setEdit((e) => ({ ...e, city_slugs: (e?.city_slugs || []).includes(slug) ? e!.city_slugs!.filter((c) => c !== slug) : [...(e?.city_slugs || []), slug] }));

  return (
    <div>
      <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Agenzie ({agencies.length})</h2>
        <Button onClick={() => setEdit({ city_slugs: [] })}><Plus className="h-4 w-4" />Nuova agenzia</Button></div>
      <div className="grid gap-3 md:grid-cols-2">
        {agencies.map((a) => (
          <div key={a.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div><h3 className="font-bold">{a.name}</h3>
                <p className="text-sm text-muted-foreground">{[a.address, a.phone, a.email].filter(Boolean).join(" · ") || "Contatti da completare"}</p>
                <p className="mt-1 text-xs text-secondary">Comuni: {a.city_slugs.map((s) => cities.find(([c]) => c === s)?.[1] || s).join(", ") || "nessuno"}</p></div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" aria-label={`Modifica ${a.name}`} onClick={() => setEdit(a)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" aria-label={`Elimina ${a.name}`} onClick={() => remove(a)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit?.id ? "Modifica agenzia" : "Nuova agenzia"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-3">
            {FIELDS.map(([k, l, t]) => (
              <div key={k}><Label htmlFor={`ag-${k}`}>{l}</Label>
                <Input id={`ag-${k}`} type={t} required={k === "name"} value={(edit?.[k] as string) || ""} onChange={(e) => setEdit({ ...edit, [k]: e.target.value || null })} /></div>
            ))}
            <fieldset><legend className="text-sm font-medium">Comuni di competenza (assegnazione automatica annunci)</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {cities.map(([slug, name]) => (
                  <label key={slug} className="flex items-center gap-1 rounded border border-border px-2 py-1 text-sm">
                    <input type="checkbox" checked={(edit?.city_slugs || []).includes(slug)} onChange={() => toggleCity(slug)} />{name}</label>
                ))}
              </div></fieldset>
            <Button type="submit" className="w-full">Salva</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AgenciesPanel;
