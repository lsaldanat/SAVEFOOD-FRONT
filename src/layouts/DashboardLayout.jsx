import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";// 👈 importa el contexto

import { Bell, Settings, Lock } from "lucide-react";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col">
        <div className="p-6 text-xl font-bold text-white tracking-wide">
          SaveFood
        </div>

        <nav className="flex-1 flex flex-col gap-2 px-2">
          <SidebarButton
            icon="🏠"
            label="Dashboard"
            onClick={() => navigate("/dashboard")}
          />
          <SidebarButton
            icon="📋"
            label="Lista de Compras"
            onClick={() => navigate("/lista")}
          />
        </nav>

        <button
          onClick={handleLogout}
          className="m-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </aside>

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Buscar..."
              className="px-3 py-1 border rounded-lg text-gray-700 dark:text-gray-200 dark:bg-gray-700 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-200 cursor-pointer" />
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-200 cursor-pointer" />
            <Lock className="w-5 h-5 text-gray-600 dark:text-gray-200 cursor-pointer" />
            {user && (
              <span className="ml-2 font-medium truncate max-w-[150px]">
                {user.email}
              </span>
            )}
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="flex-1 p-6 overflow-auto"  style={{ background: "#374151" }}  >
            <Outlet />
        </main>
      </div>
    </div>
  );
}

// 🔹 Componente auxiliar para botones del sidebar
function SidebarButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition"
    >
      <span role="img" aria-label={label.toLowerCase()}>
        {icon}
      </span>
      {label}
    </button>
  );
}
