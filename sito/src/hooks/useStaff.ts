import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type StaffState = { loading: boolean; user: User | null; roles: string[]; isAdmin: boolean; isStaff: boolean };

export function useStaff(): StaffState {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async (u: User | null) => {
      setUser(u);
      if (!u) { setRoles([]); setLoading(false); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.id);
      setRoles((data || []).map((r) => r.role));
      setLoading(false);
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setTimeout(() => load(s?.user ?? null), 0); });
    supabase.auth.getUser().then(({ data }) => load(data.user));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { loading, user, roles, isAdmin: roles.includes("admin"), isStaff: roles.includes("admin") || roles.includes("agent") };
}
