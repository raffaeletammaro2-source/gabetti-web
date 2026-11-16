import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SeoHead from "@/components/SeoHead";

const ResetPassword = () => {
  const [pw, setPw] = useState("");
  const nav = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) return toast.error(error.message);
    toast.success("Password aggiornata");
    nav("/admin");
  };
  return (
    <main className="container py-16">
      <SeoHead title="Nuova password | Gabetti" description="Imposta una nuova password." canonical="/reset-password" noindex />
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-extrabold">Scegli una nuova password</h1>
        <div><Label htmlFor="np">Nuova password</Label><Input id="np" type="password" minLength={8} required value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></div>
        <Button type="submit" className="w-full">Salva password</Button>
      </form>
    </main>
  );
};
export default ResetPassword;
