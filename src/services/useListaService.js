// services/useListaService.js
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../hooks/useAuth";

export function useListaService() {
  const { user } = useAuth();

  const useObtenerListas = async () => {
    if (!user) throw new Error("Usuario no logueado");
    const { data, error } = await supabase
      .from("ListaDeCompras")
      .select("*")
      .eq("usuario_id", user.id)
      .order("IdLista", { ascending: true });
    if (error) throw error;
    return data;
  };


  const useInsertarLista = async (lista) => {
    if (!user) throw new Error("Usuario no logueado");
    const { data, error } = await supabase
      .from("ListaDeCompras")
      .insert([{ ...lista, usuario_id: user.id }])
      .select();
    if (error) throw error;
    return data;
  };

  return { useObtenerListas, useInsertarLista };

  
}


