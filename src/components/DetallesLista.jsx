import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerDetallesPorLista, eliminarDetalle } from "../services/detalleService";
import { TrashIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function DetallesLista() {
  const { idLista } = useParams();
  const navigate = useNavigate();

  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await obtenerDetallesPorLista(idLista);
        setDetalles(data);
      } catch (error) {
        console.error("❌ Error al obtener detalles:", error);
      }
    }
    fetchData();
  }, [idLista]);

  const handleEliminar = async (idDetalle) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarDetalle(idDetalle);
      setDetalles(detalles.filter((d) => d.idDetalle !== idDetalle));
    } catch (error) {
      console.error("❌ Error al eliminar detalle:", error);
    }
  };

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
      <h2 className="text-2xl font-semibold">🛒 Detalles de la Lista #{idLista}</h2>

      {/* Botón para agregar detalle */}
      <button
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        onClick={() => navigate(`/add-detalle/${idLista}`)}
      >
        <PlusIcon className="h-5 w-5" /> Agregar Producto
      </button>

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
                <tr
                  key={detalle.idDetalle}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors"
                >
                  <td className="p-3 border-b dark:border-gray-600">{detalle.producto}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.descripcion}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.cantidad}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.unidades}</td>
                  <td className="p-3 border-b dark:border-gray-600">S/. {detalle.precio?.toFixed(2)}</td>
                  <td className="p-3 border-b dark:border-gray-600">
                    {detalle.fechaVencimiento ? new Date(detalle.fechaVencimiento).toLocaleDateString() : "-"}
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
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleMarcarComprado(detalle.idDetalle)}
                    >
                      <CheckCircleIcon className="h-5 w-5 cursor-pointer" />
                    </button>

                    {/* Eliminar */}
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleEliminar(detalle.idDetalle)}
                    >
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
