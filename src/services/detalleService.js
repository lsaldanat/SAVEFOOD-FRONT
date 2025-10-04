//const API_URL = "https://localhost:7224/api/DetalleCompra"; // tu endpoint




// AddDetalle
// export async function obtenerDetalles() {
//   try {
//     const response = await fetch(`${API_URL}/GetDetalles`);
//     if (!response.ok) throw new Error("Error al obtener los detalles");
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }

// Obtener detalles de una lista específica
// export async function obtenerDetallesPorLista(idLista) {
//   try {
//     const res = await fetch(`${API_URL}/lista/${idLista}`);
//     if (!res.ok) throw new Error("Error al obtener detalles");
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//     return [];
//   }
// }




// // Insertar un nuevo detalle
// export async function insertarDetalle(detalle) {
//   try {
//     const res = await fetch(`${API_URL}/InsertDetalle`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(detalle),
//     });
//     if (!res.ok) throw new Error("Error al insertar el detalle");
//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// Actualizar un detalle
// export async function actualizarDetalle(id, detalle) {
//   try {
//     const res = await fetch(`${API_URL}/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...detalle, idDetalle: parseInt(id) }),
//     });
//     if (!res.ok) throw new Error("Error al actualizar detalle");
//     return await res.json();
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// Eliminar un detalle
// export async function eliminarDetalle(id) {
//   try {
//     const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//     if (!res.ok) throw new Error("Error al eliminar detalle");
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }


import { supabase } from "../lib/supabaseClient";

export async function obtenerDetallexLista(IdLista) {
  

  try {

    if (!IdLista) {
      console.warn("⚠️ obtenerDetallexLista: listaId no recibido");
      return [];
    }

    const { data, error } = await supabase
      .from("DetalleCompra")
      .select("*")
      .eq("IdLista", IdLista)
      

    if (error) {
      console.error("❌ Error al obtener EL detalle de la lista por ID:", error);
      return []; // Devuelvo array vacío si hay error
    }

    return data || [];
  } catch (err) {
    // Esto atrapa el "The provided callback is no longer runnable" de React
    console.error("⚠️ Error inesperado en obtenerDetallexLista:", err.message || err);
    return [];
  }

}



export async function insertarDetallexLista(detalle) {

  const { data, error } = await supabase
    .from("DetalleCompra")
    .insert([detalle]) // Supabase espera un array

  if (error) {
    console.error("Error al insertar el detalle:", error)
    throw error
  }
  return data
}



//Eliminar un detalle
export async function eliminarDetallexId(Id) {
 
const { error } = await supabase
  .from('DetalleCompra')
  .delete()
  .eq('IdDetalle', Id)


   if (error) {
    console.error("Error al eliminar el detalle: " + Id, error)
    throw error
  }


}