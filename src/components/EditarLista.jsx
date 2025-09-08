import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerListaPorId, actualizarLista } from "../services/listaService";

export default function EditarLista() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lista, setLista] = useState({
    idLista: 0,
    nombre: "",
    descripcion: "",
    fecha: "",
    nota: "",
  });

  useEffect(() => {
    async function fetchData() {

        try {
            const data = await obtenerListaPorId(id);
            //   setLista({
            //     nombre: data.nombre,
            //     descripcion: data.descripcion,
            //     fecha: data.fecha.split("T")[0], // quitar hora
            //     nota: data.nota,
            //   });
            const fechaFormateada = data.fecha 
                                    ? new Date(data.fecha).toISOString().split("T")[0]
                                    : "";

            setLista({
                ...data,
                fecha: fechaFormateada,
            });

        } catch (error) {
            console.error("Error al obtener lista:", error);
        }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setLista({ ...lista, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await actualizarLista(id, lista);
        navigate("/");
    } catch (error) {
        console.error("Error al actualizar la nota:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">✏️ Editar Lista Completa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="nombre" value={lista.nombre} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="Nombre" required />
        <input type="text" name="descripcion" value={lista.descripcion} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="Descripción" />
        <input type="date" name="fecha" value={lista.fecha} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          required />
        <input type="text" name="nota" value={lista.nota} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          placeholder="Nota" />

        <div className="flex justify-between">
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"> Regresar </button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"> Guardar </button>
        </div>
      </form>

    </div>
  );
}
