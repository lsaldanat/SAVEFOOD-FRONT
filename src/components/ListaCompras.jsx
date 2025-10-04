import { useEffect, useState } from "react";
import { obtenerListas, insertarLista, eliminarLista  } from "../services/listaService";

import { Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


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


export default function ListaCompras() {

  const navigate = useNavigate();
  const [listas, setListas] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈 estado para controlar el envío



  const [nuevaLista, setNuevaLista] = useState({
    Nombre: "",
    Descripcion: "",
    Fecha: new Date(),  // 👈 arranca en hoy
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

    if (isSubmitting) return; // evita clicks dobles
    setIsSubmitting(true); // 🔹 deshabilita el botón

    try {


      const fechaLocal = new Date(
        nuevaLista.Fecha.getTime() - nuevaLista.Fecha.getTimezoneOffset() * 60000
      );


      // Aseguramos que la fecha esté en formato ISO
      const payload = {
        ...nuevaLista,
        Fecha: nuevaLista.Fecha 
        ? fechaLocal.toISOString()
        : null,   // 👈 si no hay fecha, manda null
      };
      // const fechaISO = nuevaLista.Fecha 
      // ? nuevaLista.Fecha.toISOString() 
      // : null;

      const dataInsertada = await insertarLista(payload);

      // Refresca la lista desde Supabase
      const dataActualizada = await obtenerListas();
      setListas(dataActualizada);
      
      // Limpiar formulario
      setNuevaLista({
        Nombre: "",
        Descripcion: "",
        Fecha: new Date(), // 👈 otra vez hoy
        Nota: "",
        IdUsuario: 1,
      });
      
    


    } catch (error) {
      console.error("Error al insertar lista:", error);
    }finally {
      setIsSubmitting(false); // 🔹 vuelve a habilitar el botón
    }
  };

    // 🔹 Eliminar
  const handleDelete = async (id) => {
    try {
      await eliminarLista(id);
      setListas((prev) => prev.filter((lista) => lista.IdLista !== id)); // refresca el estado sin hacer otra query
    } catch (error) {
      console.error("Error al eliminar lista:", error);
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
        
        <DatePickerModern value={nuevaLista.Fecha} onChange={(nuevaFecha) => setNuevaLista({ ...nuevaLista, Fecha: nuevaFecha })} required />
        
        <input type="text" name="Nota" placeholder="Nota" value={nuevaLista.Nota} onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" />

        <button type="submit" disabled={isSubmitting} 
          className={`px-6 py-2 rounded-lg text-white transition 
            ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }
              `}>
        {isSubmitting ? "⏳ Guardando..." : "➕ Agregar Lista"}
        </button>
    
      </form>

      {/* Tabla de listas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left">
              <th className="p-3 border-b dark:border-gray-600 text-center">#</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Nombre</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Descripción</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Fecha</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Nota</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">Usuario</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">*</th>
              <th className="p-3 border-b dark:border-gray-600 text-center">*</th>
            </tr>
          </thead>
          <tbody>
            {listas.map((lista, index) => (
              <tr key={lista.IdLista} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="p-3 border-b dark:border-gray-600">{index + 1 }</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Nombre}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Descripcion || "Sin descripción"}</td>
                <td className="p-3 border-b dark:border-gray-600">{format(new Date(lista.Fecha + "T00:00:00"), "dd/MM/yyyy")}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.Nota || "Sin nota"}</td>
                <td className="p-3 border-b dark:border-gray-600">{lista.IdUsuario}</td>
                
                <td className="p-2 text-center border-b dark:border-gray-600">
                  <button onClick={() => navigate(`/detalles/${lista.IdLista}`)}
                    className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition">
                    <Plus className="h-5 w-5 text-green-600 hover:text-green-800" />
                  </button>
                </td>

                
                <td className="p-2 text-center border-b dark:border-gray-600">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition">
                        <Trash className="h-5 w-5 text-red-600 hover:text-red-800" />
                      </button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar lista?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Estás a punto de eliminar <span className="font-semibold">{lista.Nombre}</span>. 
                          Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(lista.IdLista)} >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>

              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );


}
