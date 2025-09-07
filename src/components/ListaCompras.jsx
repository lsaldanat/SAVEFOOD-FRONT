import { useEffect, useState } from "react";
import { obtenerListas, insertarLista  } from "../services/listaService";

export default function ListaCompras() {
  const [listas, setListas] = useState([]);

  const [nuevaLista, setNuevaLista] = useState({
      nombre: "",
      descripcion: "",
      fecha: "",
      nota: "",
      idUsuario: 1, // prueba con usuario fijo
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
      setNuevaLista({ nombre: "", descripcion: "", fecha: "", nota: "", idUsuario: 1 });
    } catch (error) {
      console.error("Error al insertar la lista:", error);
    }
  };



  return (
    <div>
      <h1>Lista de Compras</h1>
      {/* Formulario de inserción */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>

        <input type="text" name="nombre" placeholder="Nombre" value={nuevaLista.nombre} onChange={handleChange} required />
        
        <input type="text" name="descripcion" placeholder="Descripción" value={nuevaLista.descripcion} onChange={handleChange} />
        
        <input type="date" name="fecha" value={nuevaLista.fecha} onChange={handleChange} required />

        <input type="text" name="nota" placeholder="Nota" value={nuevaLista.nota} onChange={handleChange} />
        
        <button type="submit">Agregar Lista</button>

      </form>


      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha</th>
            <th>Nota</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {listas.map((lista) => (
            <tr key={lista.idLista}>
              <td>{lista.idLista}</td>
              <td>{lista.nombre}</td>
              <td>{lista.descripcion}</td>
              <td>{new Date(lista.fecha).toLocaleDateString()}</td>
              <td>{lista.nota}</td>
              <td>{lista.usuario?.nombre || "Sin usuario"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
