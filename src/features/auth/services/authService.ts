import { supabase } from "../../../lib/supabase";

export async function checkCurrentUserIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("usuario_atual_e_admin");

  if (error) {
    console.error("Erro ao verificar permissão administrativa:", error);

    return false;
  }

  return data === true;
}
