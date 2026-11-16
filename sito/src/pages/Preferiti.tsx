import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead from "@/components/SeoHead";
import PropertyCard, { PropertyCardSkeleton } from "@/components/compra/PropertyCard";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/lib/properties";
import { removeSearch, useFavorites, useSavedSearches } from "@/lib/favorites";

const Preferiti = () => {
  const favs = useFavorites();
  const searches = useSavedSearches();
  const { data = [], isLoading } = useQuery({
    queryKey: ["favorites", favs],
    enabled: favs.length > 0,
    queryFn: async () => {
      const { data } = await supabase.from("properties").select("*").in("id", favs).eq("is_published", true);
      const rows = (data || []) as Property[];
      return favs.map((id) => rows.find((r) => r.id === id)).filter(Boolean) as Property[];
    },
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--listing-bg))]">
      <SeoHead title="I tuoi preferiti | Gabetti" description="Gli immobili e le ricerche che hai salvato." canonical="/preferiti" noindex />
      <Header />
      <main className="container py-8 space-y-10">
        <section>
          <h1 className="text-2xl md:text-3xl font-extrabold">Immobili preferiti ({favs.length})</h1>
          <p className="text-sm text-muted-foreground mt-1">Salvati su questo dispositivo.</p>
          <div className="mt-5 space-y-4">
            {favs.length === 0 && (
              <div className="rounded-xl border border-[hsl(var(--listing-border))] bg-card p-10 text-center">
                <Heart className="mx-auto h-12 w-12 text-primary" aria-hidden />
                <p className="mt-3 font-semibold">Non hai ancora salvato immobili.</p>
                <p className="text-sm text-muted-foreground">Tocca il cuore su un annuncio per ritrovarlo qui.</p>
                <Link to="/compra" className="mt-4 inline-block rounded-lg bg-primary px-5 py-3 font-bold text-primary-foreground">Cerca casa</Link>
              </div>
            )}
            {isLoading && favs.length > 0 && <PropertyCardSkeleton />}
            {data.map((p) => <PropertyCard key={p.id} p={p} />)}
          </div>
        </section>
        <section>
          <h2 className="text-xl font-extrabold">Ricerche salvate ({searches.length})</h2>
          {searches.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">Nella pagina Compra usa "Salva ricerca" per ritrovare i tuoi filtri.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border rounded-xl border border-[hsl(var(--listing-border))] bg-card">
              {searches.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 p-4">
                  <Link to={s.url} className="flex items-center gap-2 font-semibold hover:text-primary"><Search className="h-4 w-4" />{s.label}</Link>
                  <button onClick={() => removeSearch(s.id)} aria-label={`Elimina ricerca ${s.label}`} className="p-1 text-muted-foreground hover:text-primary"><X className="h-4 w-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};
export default Preferiti;
