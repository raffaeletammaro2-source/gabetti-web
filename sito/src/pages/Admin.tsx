import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStaff } from "@/hooks/useStaff";
import { Button } from "@/components/ui/button";
import SeoHead from "@/components/SeoHead";
import logo from "@/assets/gabetti-logo.png";
import AdminAuth from "@/components/admin/AdminAuth";
import PropertiesPanel from "@/components/admin/PropertiesPanel";
import AgenciesPanel from "@/components/admin/AgenciesPanel";
import UsersPanel from "@/components/admin/UsersPanel";
import LeadsPanel from "@/components/admin/LeadsPanel";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useCompraEnabled, useSetCompraEnabled } from "@/lib/siteSettings";

const Admin = () => {
  const { loading, user, isAdmin, isStaff } = useStaff();
  const { data: compraOn = true } = useCompraEnabled();
  const setCompra = useSetCompraEnabled();
  const tabs = [["annunci", "Annunci"], ["richieste", "Richieste"], ...(isAdmin ? [["agenzie", "Agenzie"], ["utenti", "Utenti"]] : [])];
  const [tab, setTab] = useState("annunci");

  return (
    <div className="min-h-screen bg-[hsl(var(--listing-bg))]">
      <SeoHead title="Area gestione | Gabetti" description="Area riservata" canonical="/admin" noindex />
      <header className="border-b-2 border-primary bg-background">
        <div className="container flex items-center justify-between py-3">
          <Link to="/"><img src={logo} alt="Gabetti Franchising" className="h-12 w-auto" /></Link>
          {user && <div className="flex items-center gap-3 text-sm"><span className="hidden md:inline text-muted-foreground">{user.email}</span>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}><LogOut className="h-4 w-4" />Esci</Button></div>}
        </div>
      </header>
      <main className="container py-8">
        {loading ? <p>Caricamento…</p> : !user ? <AdminAuth /> : !isStaff ? (
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-6 text-center">
            <h1 className="text-xl font-bold">Account in attesa di abilitazione</h1>
            <p className="mt-2 text-muted-foreground">Un amministratore deve assegnarti il ruolo di agente prima che tu possa gestire gli annunci.</p>
          </div>
        ) : (
          <>
            <nav className="mb-6 flex flex-wrap gap-2" aria-label="Sezioni area gestione">
              {tabs.map(([k, l]) => (
                <button key={k} aria-current={tab === k ? "page" : undefined} onClick={() => setTab(k)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === k ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{l}</button>
              ))}
            </nav>
            {isAdmin && (
              <label className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
                <span><span className="block font-semibold">Voce Compra nel menu</span>
                  <span className="text-sm text-muted-foreground">{compraOn ? "La voce Compra è nel menu e porta agli annunci." : "La voce Compra è nascosta dal menu del sito e delle landing."}</span></span>
                <Switch checked={compraOn} onCheckedChange={async (v) => { try { await setCompra(v); toast.success(v ? "Pagina Compra attivata" : "Pagina Compra disattivata"); } catch { toast.error("Salvataggio non riuscito"); } }} />
              </label>
            )}
            {tab === "annunci" && <PropertiesPanel />}
            {tab === "richieste" && <LeadsPanel />}
            {tab === "agenzie" && isAdmin && <AgenciesPanel />}
            {tab === "utenti" && isAdmin && <UsersPanel me={user.id} />}
          </>
        )}
      </main>
    </div>
  );
};
export default Admin;
