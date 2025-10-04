import { useEffect, useState, useRef  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrashIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

// import { obtenerDetallesPorLista, eliminarDetalle } from "../services/detalleService";
import { obtenerListaPorId } from "../services/listaService"; // 👈 importar
import { obtenerDetallexLista, insertarDetallexLista   } from "../services/detalleService";


export default function DetallesLista() {
  const { IdLista } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listaInfo, setListaInfo] = useState(null); // 👈 nombre de la lista
  const navigate = useNavigate();

  const [nuevoDetalle, setNuevoDetalle] = useState({
      Producto: "",
      Descripcion: "",
      Cantidad: 1,
      Unidades: "",
      Precio: 0,
      FechaVencimiento: "",
      IsComprado: false,
      IdCategoria: 1
    });


  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
         // obtener detalles
        const data = await obtenerDetallexLista(IdLista);
         // obtener nombre de la lista
        const lista = await obtenerListaPorId(IdLista);
        if (isMounted) {
          setDetalles(data);
          setListaInfo(lista); // 👉 aquí ya tendrás {IdLista, Nombre, Descripcion, Fecha, Nota...}
          setLoading(false);
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
      }
    }

    fetchData();

    return () => {
      isMounted = false; // 👈 evita actualizar estado tras desmontar
    };
}, [IdLista]);



const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoDetalle(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const detalleConLista = { ...nuevoDetalle, IdLista: parseInt(IdLista) };
      await insertarDetallexLista(detalleConLista);
      
      // Refresca todos los detalles
      const dataActualizada = await obtenerDetallexLista(IdLista);
      setDetalles(dataActualizada);

      setNuevoDetalle({
        Producto: "",
        Descripcion: "",
        Cantidad: 1,
        Unidades: "",
        Precio: 0,
        FechaVencimiento: "",
        IsComprado: false,
        IdCategoria: 1
      });
    } catch (error) {
      console.error("Error al agregar detalle:", error);
    }
  };


 if (loading) return <p>Cargando...</p>;

  // const handleEliminar = async (idDetalle) => {
  //   if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
  //   try {
  //     await eliminarDetalle(idDetalle);
  //     setDetalles(detalles.filter((d) => d.idDetalle !== idDetalle));
  //   } catch (error) {
  //     console.error("❌ Error al eliminar detalle:", error);
  //   }
  // };

//   const handleMarcarComprado = async (idDetalle) => {
//     try {
//       await marcarComprado(idDetalle);
//       setDetalles(
//         detalles.map((d) =>
//           d.idDetalle === idDetalle ? { ...d, isComprado: !d.isComprado } : d
//         )
//       );
//     } catch (error) {
//       console.error("❌ Error al marcar como comprado:", error);
//     }
//   };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        {/* BOTÓN VOLVER */}
        <button onClick={() => navigate("/")} // ajusta la ruta a la de tu lista de compras
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition" >
          ← Volver
        </button>


        <h2 className="text-2xl font-semibold text-center">📋 Detalles de la Lista de: {" "}
          <span className="text-blue-600 dark:text-blue-400">{listaInfo.Nombre}</span>
        </h2>
        
        {/* div vacío a la derecha para balancear el flex */}
        <div className="w-24"></div>
        
      </div>

    

      
      {/* FORMULARIO PARA AGREGAR DETALLE */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md" >
        <input type="text" name="Producto" placeholder="Producto" value={nuevoDetalle.Producto} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          required />

        <input type="text" name="Descripcion" placeholder="Descripción" value={nuevoDetalle.Descripcion} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <input type="number" name="Cantidad" placeholder="Cantidad" value={nuevoDetalle.Cantidad} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <input type="text" name="Unidades" placeholder="Unidades" value={nuevoDetalle.Unidades} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <input type="number" name="Precio" placeholder="Precio" value={nuevoDetalle.Precio} min={0} step="0.01" onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <input type="date" name="FechaVencimiento" value={nuevoDetalle.FechaVencimiento} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <div className="flex items-center gap-2">
          <input type="checkbox" name="IsComprado" checked={nuevoDetalle.IsComprado} onChange={handleChange} 
          className="w-4 h-4 accent-blue-500" />
          <label className="text-black dark:text-white">Comprado</label>
        </div>

        <button type="submit" className="col-span-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" >
          ➕ Agregar Detalle
        </button>
      </form>

      

      {/* Tabla de detalles */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-center">
              <th className="p-3 border-b dark:border-gray-600">Producto</th>
              <th className="p-3 border-b dark:border-gray-600">Descripción</th>
              <th className="p-3 border-b dark:border-gray-600">Cantidad</th>
              <th className="p-3 border-b dark:border-gray-600">Unidades</th>
              <th className="p-3 border-b dark:border-gray-600">Precio</th>
              <th className="p-3 border-b dark:border-gray-600">Vencimiento</th>
              <th className="p-3 border-b dark:border-gray-600">Estado</th>
              <th className="p-3 border-b dark:border-gray-600">*</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length > 0 ? (
              detalles.map((detalle) => (
                <tr key={detalle.IdDetalle} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors" >
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Producto}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Descripcion}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Cantidad}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Unidades}</td>
                  <td className="p-3 border-b dark:border-gray-600">S/. {detalle.Precio?.toFixed(2)}</td>
                  <td className="p-3 border-b dark:border-gray-600">
                    {detalle.FechaVencimiento ? new Date(detalle.FechaVencimiento).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3 border-b dark:border-gray-600"> 
                    {detalle.isComprado ? (
                      <span className="text-green-600 font-semibold">✔ Comprado</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Pendiente</span>
                    )}
                  </td>
                  <td className="p-3 border-b dark:border-gray-600 text-center">
                    {/* Marcar comprado */}
                    <button className="text-green-600 hover:text-green-800" onClick={() => handleMarcarComprado(detalle.idDetalle)} >
                      <CheckCircleIcon className="h-5 w-5 cursor-pointer" />
                    </button>

                    {/* Eliminar */}
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleEliminar(detalle.idDetalle)} >
                      <TrashIcon className="h-5 w-5 cursor-pointer" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  No hay productos en esta lista
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

}




