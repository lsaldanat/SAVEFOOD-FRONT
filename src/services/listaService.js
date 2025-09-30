import AddDetalle from "../components/AddDetalle";
import { supabase } from "../lib/supabaseClient";
//const API_URL = "https://localhost:7224/api/ListaDeCompras"; // tu endpoint

export async function obtenerListas() {
  // try {
  //   const response = await fetch(supabase);
  //   if (!response.ok) throw new Error("Error al obtener listas");
  //   const data = await response.json();
  //   return data;
  // } catch (error) {
  //   console.error(error);
  //   return [];
  // }
   const { data, error } = await supabase
    .from("ListaDeCompras")
    .select("*");

  if (error) throw error;
  return data;
}


export async function insertarLista(lista) {
  // const response = await fetch(supabase, {
  //   method: "POST", 
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(lista),
  // });

  // if (!response.ok) {
  //   throw new Error("Error al insertar la lista");
  // }

  // return await response.json();

  const { data, error } = await supabase
    .from("ListaDeCompras")
    .insert([lista]) // Supabase espera un array

  if (error) {
    console.error("Error al insertar lista:", error)
    throw error
  }
  return data
}


export async function obtenerListaPorId(id) {
  // try {
  //   const res = await fetch(`${API_URL}/${id}`);
  //   if (!res.ok) throw new Error("Error al obtener la lista por ID");
  //   return await res.json();
  // } catch (error) {
  //   console.error(error);
  //   return null;
  // }

const { data, error } = await supabase
    .from("ListaDeCompras")
    .select("*")
    .eq("IdLista", id)
    .single()

  if (error) {
    console.error("Error al obtener lista por ID:", error)
    return null
  }
  return data

}

export async function actualizarNota(id, nota) {
  // try {
  //   const res = await fetch(`${API_URL}/${id}/nota  `, {
  //     method: "PATCH", // o "PUT" si tu backend no acepta PATCH
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(nota),
  //   });
  //   if (!res.ok) throw new Error("Error al actualizar la nota");
  //   return await res.json();
  // } catch (error) {
  //   console.error(error);
  //   return null;
  // }

  const { data, error } = await supabase
    .from("ListaDeCompras")
    .update({ Nota: nota })
    .eq("IdLista", id)

  if (error) {
    console.error("Error al actualizar nota:", error)
    return null
  }
  return data
}


export async function actualizarLista(id, lista) {
  // const res = await fetch(`${API_URL}/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ...lista, idLista: parseInt(id) }),
  // });
  // if (!res.ok) {
  //   throw new Error("Error al actualizar la lista");
  // }
  
  // return true;
  // //return await res.json();
const { data, error } = await supabase
    .from("ListaDeCompras")
    .update(lista)
    .eq("IdLista", id)

  if (error) {
    console.error("Error al actualizar lista:", error)
    throw error
  }
  return data

}


export async function eliminarLista(id) {
  // const res = await fetch(`${API_URL}/${id}`, {
  //    method: "DELETE" 
  //   });
  // if (!res.ok) throw new Error("Error al eliminar la lista");
const { error } = await supabase
    .from("ListaDeCompras")
    .delete()
    .eq("IdLista", id)

  if (error) {
    console.error("Error al eliminar lista:", error)
    throw error
  }

}


