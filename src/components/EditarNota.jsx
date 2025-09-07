import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerListaPorId, actualizarNota } from "../services/listaService";

export default function EditarNota() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nota, setNota] = useState("");

  useEffect(() => {
    async function fetchData() {
      const lista = await obtenerListaPorId(id);
      setNota(lista.nota || "");
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarNota(id, nota);
      navigate(-1); // vuelve a la vista anterior
    } catch (error) {
      console.error("Error al actualizar la nota:", error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Nota</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            value={nota} onChange={(e) => setNota(e.target.value)} />

        <div className="flex justify-between">
          <button type="button" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
            onClick={() => navigate(-1)} >
            Regresar
          </button>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
            Guardar
          </button>
        </div>

      </form>
      

    </div>
  );
}
