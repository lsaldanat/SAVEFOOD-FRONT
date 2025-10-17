import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabaseClient";

function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);

  // ✅ Redirigir si no hay usuario (sin romper las reglas de hooks)
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]);

  // ✅ Cargar productos del usuario
  useEffect(() => {
    const fetchProductos = async () => {
      if (!user) return; // importante: no cargar si no hay user
      try {
         // 1️⃣ Obtener las listas del usuario
        const { data: listas, error: errorListas } = await supabase
          .from("ListaDeCompras")
          .select("IdLista")
          .eq("usuario_id", user.id);

        if (errorListas) throw errorListas;

        const listaIds = listas.map((l) => l.IdLista);
        if (listaIds.length === 0) {
          setProductos([]);
          setCargandoProductos(false);
          return;
        }

         // 2️⃣ Obtener productos con join automático a ListaDeCompras
        const { data: productosData, error: errorProductos } = await supabase
          .from("DetalleCompra")
          .select(`
            IdLista,
            Producto,
            Descripcion,
            Cantidad,
            FechaVencimiento,
            ListaDeCompras (
              Nombre,
              Fecha
            )
          `)
          .in("IdLista", listaIds)
          .eq("IsComprado", true)
          .order("FechaVencimiento", { ascending: true });

        if (errorProductos) throw errorProductos;

        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setCargandoProductos(false);
      }
    };

    fetchProductos();
  }, [user]);

  // ✅ Mostrar carga inicial
  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  // ✅ Mostrar mientras redirige
  if (!user) return null;

  // ✅ UI principal
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const goToLista = () => navigate("/lista");

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Productos próximos a vencer</h1>

      <div className="w-full max-w-3xl mt-6">
        {cargandoProductos ? (
          <p className="text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-center">No hay productos registrados.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-left">
              <tr>
                <th className="p-3 border-b dark:border-gray-600 text-center">Lista</th>
                <th className="p-3 border-b dark:border-gray-600 text-center">Nombre</th>
                <th className="p-3 border-b dark:border-gray-600 text-center">Descripción</th>
                <th className="p-3 border-b dark:border-gray-600 text-center">Cantidad</th>
                <th className="p-3 border-b dark:border-gray-600 text-center">Fecha de compra</th>
                <th className="p-3 border-b dark:border-gray-600 text-center">Fecha de vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-amber-950">
                  <td className="p-3 border-b dark:border-gray-600">
                    {prod.ListaDeCompras?.Nombre || "Sin lista"}
                  </td>
                  <td className="p-3 border-b dark:border-gray-600">{prod.Producto}</td>
                  <td className="p-3 border-b dark:border-gray-600">{prod.Descripcion}</td>
                  <td className="p-3 border-b dark:border-gray-600">{prod.Cantidad}</td>
                   <td className="p-3 border-b dark:border-gray-600">
                    {prod.ListaDeCompras?.Fecha
                      ? new Date(prod.ListaDeCompras.Fecha).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 border-b dark:border-gray-600">
                    {new Date(prod.FechaVencimiento).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
