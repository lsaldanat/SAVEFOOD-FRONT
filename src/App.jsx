
// 1. Librerías externas
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 2. Estilos globales
import "./App.css";

// 3. Contextos
import { AuthProvider } from "./context/AuthProvider";

// 4. Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// 5. Páginas (dentro de components/pages)
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import Dashboard from "./components/pages/Dashboard";
import ChangePassword from "./components/pages/ChangePassword";


// 6. Componentes funcionales
import ListaCompras from "./components/ListaCompras";
import DetallesLista from "./components/DetallesLista";
import PrivateRoute from "./components/PrivateRoute";

// 7. Configuración de tema (modo oscuro)
const theme = localStorage.getItem("theme");
if (theme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

// 8. Componente principal
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirigir "/" al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Rutas públicas con AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Rutas privadas con DashboardLayout */}
          <Route 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/lista" element={<ListaCompras />} />
            <Route path="/detalles/:IdLista" element={<DetallesLista />} />

          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

