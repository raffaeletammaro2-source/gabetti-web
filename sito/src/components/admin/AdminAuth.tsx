import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminAuth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
        if (error) throw error;
        toast.success("Controlla la tua email", { description: "Conferma l'indirizzo per completare la registrazione." });
        setMode("login");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        toast.success("Email inviata", { description: "Segui il link per scegliere una nuova password." });
        setMode("login");
      }
    } catch (err) {
      toast.error((err as Error).message === "Invalid login credentials" ? "Email o password errati" : (err as Error).message);
    } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-extrabold">{mode === "login" ? "Accesso area gestione" : mode === "signup" ? "Registrati" : "Recupera password"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Riservata ad amministratori e agenti Gabetti.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div><Label htmlFor="em">Email</Label><Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
        {mode !== "forgot" && <div><Label htmlFor="pw">Password</Label><Input id="pw" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} /></div>}
        <Button type="submit" className="w-full" disabled={busy}>{mode === "login" ? "Accedi" : mode === "signup" ? "Crea account" : "Invia link"}</Button>
      </form>
      <div className="mt-4 flex flex-col gap-1 text-sm">
        {mode !== "login" && <button className="text-primary underline" onClick={() => setMode("login")}>Hai già un account? Accedi</button>}
        {mode === "login" && <><button className="text-primary underline" onClick={() => setMode("signup")}>Nuovo agente? Registrati</button>
          <button className="text-secondary underline" onClick={() => setMode("forgot")}>Password dimenticata?</button></>}
      </div>
    </div>
  );
};
export default AdminAuth;
