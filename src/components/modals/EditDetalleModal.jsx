import { useEffect, useState, useRef  } from "react";
import { motion } from "framer-motion";
import { Edit } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  Portal
} from "@/components/ui/dialog";

import { actualizarDetallexId } from "@/services/detalleService";


// DatePickerModern
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


import MonthYearPicker from "@/components/MonthYearPicker";


export function DatePickerMesAno({ value, onChange }) {
  
  const [date, setDate] = useState(value ? new Date(value) : new Date());

  // Sincroniza con value del padre
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      d.setDate(1);       // día fijo
      d.setHours(0,0,0,0);// hora fija
      setDate(d);
    }
  }, [value]);

  const handleSelect = (d) => {
    if (!d) return;
    d.setDate(1);
    d.setHours(0,0,0,0);
    setDate(d);
    onChange(d);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
         <button type="button" className="w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600" >
          {date ? format(date, "dd/MM/yyyy") : "Seleccionar fecha"}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} 
        onSelect={handleSelect}
        captionLayout="dropdown"  // 👈 aquí el truco: agrega select de mes y año
        fromYear={2025}
        toYear={2030}
        initialFocus />
      </PopoverContent>
    </Popover>
  );
}



export default function EditDetalleModal({ detalle, unidadesMedida, onSave }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...detalle });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const actualizado = await actualizarDetallexId(form.IdDetalle, form);
      if (actualizado) {
        onSave(actualizado); // ✅ avisa al padre
        setOpen(false);
      } else {
        console.error("No se pudo actualizar el detalle");
      }
    } catch (error) {
      console.error("Error al actualizar detalle:", error);
    } finally {
      setLoading(false);
    }
  };

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

              {/* FORMULARIO */}
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
                  className="w-full px-4 py-2 border rounded-lgfocus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
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
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                  <input
                    type="number" name="Precio" value={form.Precio ?? ""} onChange={handleChange} min={0} step="0.01"
                    className="w-full pl-8 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    placeholder="Precio"
                  />
                </div>

                {/* Fecha de Vencimiento */}
                <MonthYearPicker
                    value={form.FechaVencimiento ?? null}
                    onChange={(nuevaFecha) =>
                        setForm((prev) => ({ ...prev, FechaVencimiento: nuevaFecha.toISOString().split("T")[0] // YYYY-MM-01
                        }))
                    }
                    fromYear={2025}
                    toYear={2032}
                    darkMode={true}
                />
                
              </div>


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
