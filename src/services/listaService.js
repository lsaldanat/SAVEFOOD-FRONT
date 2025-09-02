const API_URL = "https://localhost:7224/api/ListaDeCompras"; // tu endpoint

export async function obtenerListas() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error al obtener listas");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
