import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  // Mientras se carga el estado de autenticación
  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  // Si no hay usuario autenticado, redirige a login
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout(); // Usa la función del contexto
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const goToLista = () => navigate("/lista");

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Bienvenido {user.email}</h1>

      <button
        onClick={goToLista}
        className="mt-4 w-48 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Ir a Lista de Compras
      </button>

      <button
        onClick={handleLogout}
        className="mt-2 w-48 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Dashboard;

