import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCompraEnabled = () =>
  useQuery({
    queryKey: ["site_settings", "compra_enabled"],
    queryFn: async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "compra_enabled").maybeSingle();
      return data ? data.value !== false : true;
    },
    staleTime: 60000,
  });

export const useSetCompraEnabled = () => {
  const qc = useQueryClient();
  return async (enabled: boolean) => {
    const { error } = await supabase.from("site_settings").upsert({ key: "compra_enabled", value: enabled, updated_at: new Date().toISOString() });
    if (error) throw error;
    qc.setQueryData(["site_settings", "compra_enabled"], enabled);
  };
};
