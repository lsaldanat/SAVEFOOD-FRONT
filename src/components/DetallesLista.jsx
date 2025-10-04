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


//Animacion modal
import { motion } from "framer-motion";

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


export function EditDetalleModal({ detalle, unidadesMedida, onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...detalle });
  const [loading, setLoading] = useState(false); // para deshabilitar botón mientras actualiz


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {

    
    try {
      setLoading(true); // deshabilita el botón 
      const actualizado = await actualizarDetallexId(form.IdDetalle, form);
      if (actualizado) {
        onSave(actualizado); // 🔹 actualiza el estado en el padre
        setOpen(false);
      } else {
        console.error("No se pudo actualizar el detalle");
      }
    } catch (error) {
      console.error("Error al actualizar detalle:", error);
    } finally {
      setLoading(false);
    }   


    onSave(form);
    setOpen(false);
  };

  <select
    name="UnidadMedida"
    value={form.UnidadMedida ?? ""}
    onChange={handleChange}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
  >
    {unidadesMedida.map((um) => (
      <option key={um.id} value={um.id}>{um.descripcion}</option>
    ))}
  </select>

  return (
    
      

      

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <Edit className="h-5 w-5 text-blue-600" />
        </button>
      </DialogTrigger>

      <Portal>
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <DialogContent asChild>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="sm:max-w-lg sm:w-full rounded-xl p-6 bg-white dark:bg-gray-900 shadow-lg"
            >
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Editar Detalle
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4 text-center">
                Modifica la información del producto.
              </DialogDescription>

              {/* FORMULARIO COMPLETO */}
              <div className="grid gap-4">

                {/* Producto */}
                <input
                  type="text" name="Producto" value={form.Producto || ""} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Producto"
                />

                {/* Descripción */}
                <input
                  type="text" name="Descripcion" value={form.Descripcion || ""} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Descripción"
                />

                {/* Cantidad */}
                <input
                  type="number" name="Cantidad" value={form.Cantidad ?? ""} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  placeholder="Cantidad"
                />

                {/* Unidad de medida */}
                <select
                  name="UnidadMedida" value={form.UnidadMedida ?? ""} onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                  {unidadesMedida.map((um) => (
                    <option key={um.id} value={um.id}>{um.descripcion}</option>
                  ))}
                </select>

                {/* Precio */}
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">S/</span>
                  <input
                    type="number" name="Precio" value={form.Precio ?? ""} onChange={handleChange} min={0} step="0.01"
                    className="w-full pl-8 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Precio"
                  />
                </div>

                {/* Fecha de Vencimiento */}
                <DatePickerModern
                  value={form.FechaVencimiento}
                  onChange={(nuevaFecha) =>
                    setForm((prev) => ({ ...prev, FechaVencimiento: nuevaFecha }))
                  }
                />

              </div>
              {/* FIN FORMULARIO COMPLETO */}

              {/* BOTONES */}
              <div className="mt-6 flex justify-end gap-3">
                <DialogClose asChild>
                  <button className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 transition">
                    Cancelar
                  </button>
                </DialogClose>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                  {loading ? "Guardando..." : "Confirmar"}
                </button>
              </div>
            </motion.div>
          </DialogContent>
        </div>
      </Portal>
    </Dialog>

    
  );
}




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
              <th className="p-3 border-b dark:border-gray-600">*</th>
            </tr>
          </thead>
          <tbody>
            {detalles.length > 0 ? (
              detalles.map((detalle) => (
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
                    {detalle.FechaVencimiento ? new Date(detalle.FechaVencimiento).toLocaleDateString() : "-"}
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




