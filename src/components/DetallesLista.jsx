import { useEffect, useState, useRef  } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TrashIcon, CheckCircleIcon, PlusIcon } from "@heroicons/react/24/outline";

// import { obtenerDetallesPorLista, eliminarDetalle } from "../services/detalleService";
import { obtenerListaPorId } from "../services/listaService"; // 👈 importar
import { obtenerDetallexLista, insertarDetallexLista, eliminarDetallexId, actualizarIsComprado, actualizarDetallexId    } from "../services/detalleService";

import { obtenerUnidadMedidas } from "../services/UnidadMedida"; // 👈 importar
import { Checkbox } from "@/components/ui/checkbox"

// DatePickerModern
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import EditDetalleModal from "@/components/modals/EditDetalleModal";


import { Plus, Trash, Edit  } from "lucide-react";
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

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  // DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogFooter,
  DialogClose,
  Portal
} from "@/components/ui/dialog"; // si usas tus componentes Radix UI

import { Button } from "@/components/ui/button";


import MonthYearPicker from "@/components/MonthYearPicker";

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
        captionLayout="dropdown"  // 👈 aquí el truco: agrega select de mes y año
        fromYear={2025}
        toYear={2030}
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

  const [searchTerm, setSearchTerm] = useState("");

  const fecha = new Date();
      fecha.setHours(0,0,0,0);
      
  const [nuevoDetalle, setNuevoDetalle] = useState({
      Producto: "",
      Descripcion: "",
      Cantidad: null,
      UnidadMedida: 4,
      Precio: null,
      FechaVencimiento: fecha.toISOString().split("T")[0], // "YYYY-MM-DD"
      IsComprado: false
    });

  // Filtrar detalles según el searchTerm
  const detallesFiltrados = detalles.filter((detalle) => {
    const term = searchTerm.toLowerCase();
    return (
      detalle.Producto.toLowerCase().includes(term) ||
      detalle.Descripcion.toLowerCase().includes(term)
    );
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

      const fecha = new Date();
      fecha.setHours(0,0,0,0);

      setNuevoDetalle({
        Producto: "",
        Descripcion: "",
        Cantidad: null,
        UnidadMedida: 4,
        Precio: null,
        FechaVencimiento: fecha.toISOString().split("T")[0], // "YYYY-MM-DD"
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

    // 🔹 Actualizar el estado del comprado
    const handleUpdateIsComprado  = async (id, isComprado) => {
      try {
        await actualizarIsComprado(id, isComprado);
        setDetalles((prev) =>
          prev.map((detalle) =>
            detalle.IdDetalle === id
              ? { ...detalle, IsComprado: isComprado } // 🔹 actualiza solo el campo cambiado
              : detalle
          )
        );
      } catch (error) {
        console.error("Error al eliminar el detalle: " + id, error);
      }
    };
    


  if (loading) return <p>Cargando...</p>;


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors" >
      <div className="flex justify-between items-center">
        {/* BOTÓN VOLVER */}
        <button onClick={() => navigate("/lista")} // ajusta la ruta a la de tu lista de compras
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

        {/* Fecha de Vencimiento con MonthYearPicker */}
        <MonthYearPicker
          value={nuevoDetalle.FechaVencimiento ?? null}
          onChange={(nuevaFecha) =>
            setNuevoDetalle(prev => ({
              ...prev,
              FechaVencimiento: nuevaFecha.toISOString().split("T")[0] // YYYY-MM-01
            }))
          }
          fromYear={2025}
          toYear={2032}
          darkMode={true} required
        />

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

      {/* INPUT DE BÚSQUEDA */}
      <div className="my-4 flex justify-end">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Buscar Producto o Descripción..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          
          <svg 
            className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
      </div>

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
              <th className="p-3 border-b dark:border-gray-600">*</th>
            </tr>
          </thead>
          <tbody>
            {detalles.filter(detalle =>
              detalle.Producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
              detalle.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(detalle => (
                            <tr key={detalle.IdDetalle} className="hover:bg-gray-50 dark:hover:bg-gray-700 text-center transition-colors" >
                            

                              <td className="p-3 border-b dark:border-gray-600 text-center">
                                <Checkbox
                                  checked={detalle.IsComprado} // 🔹 valor actual del estado
                                  onCheckedChange={(checked) =>
                                    handleUpdateIsComprado(detalle.IdDetalle, checked)
                                  }
                                />
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
                                {detalle.FechaVencimiento ? detalle.FechaVencimiento.split('-')[1]+"/"+detalle.FechaVencimiento.split('-')[0] : "-"}
                              </td>
                              <td className="p-3 border-b dark:border-gray-600"> 
                                {detalle.IsComprado ? (
                                  <span className="text-green-600 font-semibold">Comprado</span>
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

                            

                            <td className="p-2 text-center border-b dark:border-gray-600">
                              <EditDetalleModal
                                detalle={detalle}
                                unidadesMedida={unidadesMedida} // ✅ aquí
                                onSave={(updatedDetalle) => {
                                  setDetalles(prev =>
                                    prev.map(d => d.IdDetalle === updatedDetalle.IdDetalle ? updatedDetalle : d)
                                  );
                                }}
                              />

                            </td>

                          </tr>
            ))}

            {detalles.filter(detalle =>
              detalle.Producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
              detalle.Descripcion.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
              <tr>
                <td colSpan="10" className="p-4 text-center text-gray-500">
                  No se encontraron productos
                </td>
              </tr>
            )}
        </tbody>
        </table>
      </div>
    </div>
  );

}




