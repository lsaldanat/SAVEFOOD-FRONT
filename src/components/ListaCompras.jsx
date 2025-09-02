import { useEffect, useState } from "react";
import { obtenerListas } from "../services/listaService";

export default function ListaCompras() {
  const [listas, setListas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await obtenerListas();
      setListas(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h1>Lista de Compras</h1>
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
