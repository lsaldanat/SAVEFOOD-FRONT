import { useEffect, useState } from "react";
import { obtenerListas, insertarLista  } from "../services/listaService";

import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";



export default function ListaCompras() {

  const navigate = useNavigate();
  const [listas, setListas] = useState([]);

  const [nuevaLista, setNuevaLista] = useState({
    Nombre: "",
    Descripcion: "",
    Fecha: "",
    Nota: "",
    IdUsuario: 1,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const data = await obtenerListas();
        if (isMounted) setListas(data);
      } catch (error) {
        console.error("Error al obtener listas:", error);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e) => {
    setNuevaLista({ ...nuevaLista, [e.target.name]: e.target.value });
  };


   // 🔹 Aquí hacemos la inserción real
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      // Aseguramos que la fecha esté en formato ISO
      const payload = {
        ...nuevaLista,
        Fecha: new Date(nuevaLista.Fecha).toISOString()
      };

      const dataInsertada = await insertarLista(payload);

      // Refresca la lista desde Supabase
      const dataActualizada = await obtenerListas();
      setListas(dataActualizada);
      
      // Limpiar formulario
      setNuevaLista({
        Nombre: "",
        Descripcion: "",
        Fecha: "",
        Nota: "",
        IdUsuario: 1,
      });
      
    


    } catch (error) {
      console.error("Error al insertar lista:", error);
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Registrar Nueva Lista</h1>

      

      {/* Formulario */}
      <form className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-4 transition-colors" onSubmit={handleSubmit} >
        <input type="text" name="Nombre" placeholder="Nombre" value={nuevaLista.Nombre} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" required />
        
        <input type="text" name="Descripcion" placeholder="Descripción" value={nuevaLista.Descripcion} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" />
        
        <input type="date" name="Fecha" value={nuevaLista.Fecha || ''} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" required />
        
        <input type="text" name="Nota" placeholder="Nota" value={nuevaLista.Nota} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" />

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition" >
          ➕ Agregar Lista
        </button>
    
      </form>

      {/* Tabla de listas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3 border-b dark:border-gray-600 text-center">ID</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Nombre</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Descripción</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Fecha</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Nota</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Usuario</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">*</th>
            </tr>
          </thead>
          <tbody>
            {listas.map((lista) => (
              <tr key={lista.IdLista} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-3 border-b dark:border-gray-600">{lista.IdLista}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Nombre}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Descripcion || "Sin descripción"}</td>
                <td className="p-3 border-b dark:border-gray-600">{new Date(lista.Fecha).toLocaleDateString()}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Nota || "Sin nota"}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.IdUsuario}</td>
                <td className="p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition">
                  <button onClick={() => navigate(`/detalles/${lista.IdLista}`)}>
                    <Plus className="h-5 w-5 text-green-600 hover:text-green-800" />
                  </button>
                
                {/* Tooltip */}
                <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                  Agregar el detalle +
                </span>
                
                
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


}
