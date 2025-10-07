import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
// import { logout } from "../../services/auth"; // 👈 reutilizas el servicio

function Dashboard() {
  const { user, loading, logout  } = useAuth(); // 👈 usuario global
  const navigate = useNavigate();

  if (loading) return <p>Cargando...</p>;

   const handleLogout = async () => {
    await logout();        // 👈 en vez de supabase.auth.signOut()
    navigate("/login");
  };

  const goToLista = () => navigate("/lista");
  
  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Bienvenido {user.email}</h1>
      <button
        onClick={goToLista}
        className="mt-4 w-48 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Ir a Lista de Compras
      </button>
      
      <button
        onClick={handleLogout}
        className="mt-2 w-48 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
        Cerrar sesión
      </button>
    </div>
  );
}

// 👇 Exportación por defecto obligatoria
export default Dashboard;
