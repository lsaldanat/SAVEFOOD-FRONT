import { useEffect, useState, useRef  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrashIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

// import { obtenerDetallesPorLista, eliminarDetalle } from "../services/detalleService";
import { obtenerListaPorId } from "../services/listaService"; // 👈 importar
import { obtenerDetallexLista, insertarDetallexLista, eliminarDetallexId   } from "../services/detalleService";

import { obtenerUnidadMedidas } from "../services/UnidadMedida"; // 👈 importar


// DatePickerModern
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


import { Plus, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DatePickerModern({ value, onChange }) {
  
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  // 🔹 Si cambia "value" desde el padre, sincronizar con el estado local
  useEffect(() => {
    setDate(value ? new Date(value) : new Date());
  }, [value]);

  return (
    <Popover>
      <PopoverTrigger asChild>
         <button type="button" className="w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" >
          {date ? format(date, "dd/MM/yyyy") : "Seleccionar fecha"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} 
        onSelect={(d) => {
                            setDate(d);
                            onChange(d);
                          }}
          initialFocus />
      </PopoverContent>
    </Popover>
  );
}



export default function DetallesLista() {
  const { IdLista } = useParams();
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listaInfo, setListaInfo] = useState(null); // 👈 nombre de la lista
  const [unidadesMedida, setUnidadesMedida] = useState([]); // 👈 estado global en el componente
  const navigate = useNavigate();

  const [nuevoDetalle, setNuevoDetalle] = useState({
      Producto: "",
      Descripcion: "",
      Cantidad: null,
      UnidadMedida: 4,
      Precio: null,
      FechaVencimiento: new Date().setHours(0, 0, 0, 0),
      IsComprado: false
    });


  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
         // obtener detalles
        const data = await obtenerDetallexLista(IdLista);
         // obtener nombre de la lista
        const lista = await obtenerListaPorId(IdLista);

        const unidades  = await obtenerUnidadMedidas();

        if (isMounted) {
          setDetalles(data);
          setListaInfo(lista); // 👉 aquí ya tendrás {IdLista, Nombre, Descripcion, Fecha, Nota...}
          setUnidadesMedida(unidades); // 👈 carga las unidades de medida
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
        Cantidad: null,
        UnidadMedida: 4,
        Precio: null,
        FechaVencimiento: new Date().setHours(0, 0, 0, 0),
        IsComprado: false
      });
    } catch (error) {
      console.error("Error al agregar detalle:", error);
    }
  };

    // 🔹 Eliminar
    const handleDelete = async (id) => {
      try {
        await eliminarDetallexId(id);
        setDetalles((prev) => prev.filter((detalle) => detalle.IdDetalle !== id)); // refresca el estado sin hacer otra query
      } catch (error) {
        console.error("Error al eliminar el detalle: " + id, error);
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
        
        <input type="text" name="Producto" placeholder="Producto" value={nuevoDetalle.Producto ?? ""} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
          required />

        <input type="text" name="Descripcion" placeholder="Descripción" value={nuevoDetalle.Descripcion ?? ""} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <DatePickerModern value={nuevoDetalle.FechaVencimiento} onChange={(nuevaFecha) => setNuevoDetalle({ ...nuevoDetalle, FechaVencimiento: nuevaFecha })} required />

        <input type="number" name="Cantidad" placeholder="Cantidad" value={nuevoDetalle.Cantidad ?? ""} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <select name="UnidadMedida" value={nuevoDetalle.UnidadMedida} onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600">
          {unidadesMedida.map((um) => (
            <option key={um.id} value={um.id}>{um.descripcion}</option>
          ))}
        </select>

        <input type="number" name="Precio" placeholder="Precio" value={nuevoDetalle.Precio ?? ""} min={0} step="0.01" onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
        />

        <button type="submit" className="col-span-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" >
          ➕ Agregar Detalle
        </button>

      </form>

      

      {/* Tabla de detalles */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-md rounded-lg transition-colors">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-center">
              <th className="p-3 border-b dark:border-gray-600">*</th>
              <th className="p-3 border-b dark:border-gray-600">Producto</th>
              <th className="p-3 border-b dark:border-gray-600">Descripción</th>
              <th className="p-3 border-b dark:border-gray-600">Cantidad</th>
              <th className="p-3 border-b dark:border-gray-600">U.M.</th>
              <th className="p-3 border-b dark:border-gray-600">Precio</th>
              <th className="p-3 border-b dark:border-gray-600">Vencimiento</th>
              <th className="p-3 border-b dark:border-gray-600">Estado</th>
              {/* <th className="p-3 border-b dark:border-gray-600">*</th> */}
              <th className="p-3 border-b dark:border-gray-600">*</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length > 0 ? (
              detalles.map((detalle) => (
                <tr key={detalle.IdDetalle} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors" >
                  <td className="p-3 border-b dark:border-gray-600 text-center">
                    <input type="checkbox" />
                  </td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Producto}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Descripcion}</td>
                  <td className="p-3 border-b dark:border-gray-600">{detalle.Cantidad}</td>
                  <td className="p-3 border-b dark:border-gray-600">{unidadesMedida.find(um => um.id == detalle.UnidadMedida).descripcion }</td>
                  <td className="p-3 border-b dark:border-gray-600">
                    {detalle.Precio != null
                      ? new Intl.NumberFormat("es-PE", {
                          style: "currency",
                          currency: "PEN",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(detalle.Precio)
                      : "-"}
                  </td>

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

                <td className="p-2 text-center border-b dark:border-gray-600">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition"
                         onClick={(e) => e.stopPropagation()} // 👈 evita navigate al abrir el dialog
                        >

                        <Trash className="h-5 w-5 text-red-600 hover:text-red-800" />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar lista?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de eliminar <span className="font-semibold">{detalle.Producto}</span>. 
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" 
                        onClick={(e) => {
                        e.stopPropagation(); // 👈 evita que se dispare el navigate
                        handleDelete(detalle.IdDetalle);}} >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>


                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
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




