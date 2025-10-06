import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Verificar sesión actual al cargar
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // ✅ Escuchar cambios de sesión (login / logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <p className="text-white">Cargando...</p>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Si no hay usuario → login */}
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        {/* Redirigir raíz */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
