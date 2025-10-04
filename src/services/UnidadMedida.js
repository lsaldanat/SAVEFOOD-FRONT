import { supabase } from "../lib/supabaseClient";


export async function obtenerUnidadMedidas() {
  
const { data, error } = await supabase
    .from("UnidadMedida")
    .select("*")
    .order("id", { ascending: true }); // 👈 aquí fuerzas el orden

  if (error) throw error;
  return data;

}