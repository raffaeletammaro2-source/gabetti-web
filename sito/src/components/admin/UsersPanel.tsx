import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type Row = { id: string; email: string; created_at: string; roles: string[] };

const UsersPanel = ({ me }: { me: string }) => {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => { const { data, error } = await supabase.rpc("admin_list_users"); if (error) throw error; return data as Row[]; },
  });
  const setRole = async (u: Row, role: "admin" | "agent", on: boolean) => {
    const { error } = on
      ? await supabase.from("user_roles").insert({ user_id: u.id, role })
      : await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", role);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-users"] });
  };
  return (
    <div>
      <h2 className="text-xl font-bold">Utenti</h2>
      <p className="mb-4 text-sm text-muted-foreground">Chi si registra non vede nulla finché non gli assegni un ruolo. Agente = gestisce gli annunci; Amministratore = gestisce tutto.</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr><th className="p-3">Email</th><th className="p-3">Registrato</th><th className="p-3">Agente</th><th className="p-3">Amministratore</th></tr></thead>
          <tbody>{data.map((u) => (
            <tr key={u.id} className="border-t border-border">
              <td className="p-3">{u.email}</td><td className="p-3">{new Date(u.created_at).toLocaleDateString("it-IT")}</td>
              <td className="p-3"><input type="checkbox" aria-label={`Agente ${u.email}`} checked={u.roles.includes("agent")} onChange={(e) => setRole(u, "agent", e.target.checked)} /></td>
              <td className="p-3"><input type="checkbox" aria-label={`Amministratore ${u.email}`} disabled={u.id === me} checked={u.roles.includes("admin")} onChange={(e) => setRole(u, "admin", e.target.checked)} /></td>
            </tr>))}</tbody>
        </table>
      </div>
    </div>
  );
};
export default UsersPanel;
