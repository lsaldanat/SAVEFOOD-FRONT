import './App.css'
//import TestForm from "./components/TestForm";
import ThemeToggle from "./components/ThemeToggle";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ListaCompras from "./components/ListaCompras";
import DetallesLista from "./components/DetallesLista"; // importa tu componente

import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import Dashboard from "./components/pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* ✅ Rutas de la app */}
        <Routes>

           {/* Si alguien entra a "/", lo mandamos al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/lista"
            element={
              <PrivateRoute>
                <ListaCompras />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/detalles/:IdLista"
            element={
              <PrivateRoute>
                <DetallesLista />
              </PrivateRoute>
            }
          />
        
        </Routes>
      </AuthProvider>
      
    </BrowserRouter>
  );
}

export default App
