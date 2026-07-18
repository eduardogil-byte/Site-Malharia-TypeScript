import { supabase } from "../../../lib/supabase";

export async function checkSupabaseConnection(): Promise<boolean> {
  const { data, error } = await supabase.rpc("health_check");

  if (error) {
    console.error("Erro ao verificar o Supabase:", error, data);
    return false;
  }

  return data === "ok";
}
