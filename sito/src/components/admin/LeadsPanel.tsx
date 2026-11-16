import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LeadsPanel = () => {
  const { data = [] } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const leads = (await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200)).data || [];
      const ids = [...new Set(leads.map((l) => l.property_id).filter(Boolean))] as string[];
      const props = ids.length ? (await supabase.from("properties").select("id, title, reference_code").in("id", ids)).data || [] : [];
      return leads.map((l) => ({ ...l, properties: props.find((p) => p.id === l.property_id) }));
    },
  });
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Richieste dagli annunci ({data.length})</h2>
      <div className="space-y-3">
        {data.map((l: any) => (
          <div key={l.id} className="rounded-xl border border-border bg-card p-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <strong>{l.name} · {l.type === "visita" ? `Visita${l.visit_date ? ` il ${new Date(l.visit_date).toLocaleDateString("it-IT")}` : ""}` : "Informazioni"}</strong>
              <span className="text-muted-foreground">{new Date(l.created_at).toLocaleString("it-IT")}</span>
            </div>
            <p className="text-secondary">{l.properties ? `Rif. ${l.properties.reference_code} – ${l.properties.title}` : "Annuncio non più disponibile"}</p>
            <p><a className="text-primary underline" href={`mailto:${l.email}`}>{l.email}</a>{l.phone && <> · <a className="text-primary underline" href={`tel:${l.phone}`}>{l.phone}</a></>}</p>
            {l.message && <p className="mt-1 whitespace-pre-line">{l.message}</p>}
          </div>
        ))}
        {data.length === 0 && <p className="text-muted-foreground">Nessuna richiesta.</p>}
      </div>
    </div>
  );
};
export default LeadsPanel;
