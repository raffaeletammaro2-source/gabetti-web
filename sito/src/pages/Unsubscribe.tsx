import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "valid" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (res.ok && data.valid) setState({ kind: "valid" });
        else if (data.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) setState({ kind: "success" });
      else if (data?.reason === "already_unsubscribed") setState({ kind: "already" });
      else setState({ kind: "error", message: "Si è verificato un errore. Riprova." });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Errore" });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">Disiscrizione email</h1>

        {state.kind === "loading" && (
          <p className="text-muted-foreground">Verifica del link in corso…</p>
        )}

        {state.kind === "valid" && (
          <>
            <p className="text-muted-foreground mb-6">
              Conferma per non ricevere più email da Gabetti Valutazioni.
            </p>
            <button
              onClick={confirm}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity"
            >
              Conferma disiscrizione
            </button>
          </>
        )}

        {state.kind === "submitting" && (
          <p className="text-muted-foreground">Disiscrizione in corso…</p>
        )}

        {state.kind === "success" && (
          <p className="text-foreground">
            ✅ Sei stato disiscritto. Non riceverai più email da noi.
          </p>
        )}

        {state.kind === "already" && (
          <p className="text-foreground">Risulti già disiscritto. Nessuna ulteriore azione necessaria.</p>
        )}

        {state.kind === "invalid" && (
          <p className="text-destructive">Link non valido o scaduto.</p>
        )}

        {state.kind === "error" && (
          <p className="text-destructive">{state.message}</p>
        )}
      </div>
    </main>
  );
};

export default Unsubscribe;
