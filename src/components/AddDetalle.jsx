import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// importa el servicio que insertará el detalle
import { insertarDetalle } from "../services/detalleService";

export default function AddDetalle() {
  const { idLista } = useParams(); // viene de la URL
  const navigate = useNavigate();

  const [detalle, setDetalle] = useState({
    idLista: parseInt(idLista),
    producto: "",
    descripcion: "",
    unidades: "",
    cantidad: 1,
    fechaVencimiento: "",
    precio: 0,
    isComprado: false,
    idCategoria: null,
  });

  const handleChange = (e) => {
    setDetalle({
      ...detalle,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await insertarDetalle(detalle);
      alert("✅ Detalle agregado correctamente");
      //navigate(-1); // vuelve a la lista
      navigate(`/detalles/${idLista}`);
    } catch (error) {
      console.error("❌ Error al insertar detalle:", error);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg space-y-6">
      <h2 className="text-xl font-semibold">Agregar Detalle a la Lista #{idLista}</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" 
          name="producto" placeholder="Producto" value={detalle.producto} onChange={handleChange} required />

        <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" type="text"
          name="descripcion" placeholder="Descripción" value={detalle.descripcion} onChange={handleChange} />

        <select className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" name="unidades"
          value={detalle.unidades} onChange={handleChange} required >
          <option value="">Seleccione unidad</option>
          <option value="Kg">Kg</option>
          <option value="Litro">Litro</option>
          <option value="Pack">Pack</option>
        </select>

        <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" type="number"
            name="cantidad" placeholder="Cantidad" value={detalle.cantidad} onChange={handleChange} required />

        <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" type="date"
            name="fechaVencimiento" value={detalle.fechaVencimiento} onChange={handleChange} />

        <input className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700" type="number"
            name="precio" step="0.01" placeholder="Precio" value={detalle.precio} onChange={handleChange} />

        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700" > 💾 Guardar Detalle </button>
      </form>
    </div>
  );
}
