import { useEffect, useState } from "react";
import { obtenerListas, insertarLista } from "../services/listaService";
import ThemeToggle from "./ThemeToggle"; // 👈 importa el botón

export default function ListaCompras() {
  const [listas, setListas] = useState([]);
  const [nuevaLista, setNuevaLista] = useState({
    nombre: "",
    descripcion: "",
    fecha: "",
    nota: "",
    idUsuario: 1, // usuario fijo de prueba
  });

  useEffect(() => {
    async function fetchData() {
      const data = await obtenerListas();
      setListas(data);
    }
    fetchData();
  }, []);

  const handleChange = (e) => {
    setNuevaLista({
      ...nuevaLista,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🚀 handleSubmit disparado");
    console.log("Payload que envío al backend:", { ...nuevaLista });
    try {
      const listaInsertada = await insertarLista(nuevaLista);
      setListas([...listas, listaInsertada]);
      setNuevaLista({
        nombre: "",
        descripcion: "",
        fecha: "",
        nota: "",
        idUsuario: 1,
      });
    } catch (error) {
      console.error("Error al insertar la lista:", error);
    }
  };

  
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 transition-colors"
      >
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevaLista.nombre}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevaLista.descripcion}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="date"
          name="fecha"
          value={nuevaLista.fecha}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="text"
          name="nota"
          placeholder="Nota"
          value={nuevaLista.nota}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Agregar Lista
        </button>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3 border-b dark:border-gray-600">ID</th>
              <th className="p-3 border-b dark:border-gray-600">Nombre</th>
              <th className="p-3 border-b dark:border-gray-600">Descripción</th>
              <th className="p-3 border-b dark:border-gray-600">Fecha</th>
              <th className="p-3 border-b dark:border-gray-600">Nota</th>
              <th className="p-3 border-b dark:border-gray-600">Usuario</th>
            </tr>
          </thead>
          <tbody>
            {listas.map((lista) => (
              <tr
                key={lista.idLista}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="p-3 border-b dark:border-gray-600">{lista.idLista}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.nombre}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.descripcion}</td>
                <td className="p-3 border-b dark:border-gray-600">
                  {new Date(lista.fecha).toLocaleDateString()}
                </td>
                <td className="p-3 border-b dark:border-gray-600">{lista.nota}</td>
                <td className="p-3 border-b dark:border-gray-600">
                  {lista.usuario?.nombre || "Sin usuario"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
