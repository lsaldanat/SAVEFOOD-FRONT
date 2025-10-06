import { useState, useEffect } from "react";
import { getCurrentSession, logout, onAuthStateChange } from "../services/auth";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sesión inicial
    // ✅ función interna asíncrona para cargar la sesión inicial
    const loadSession = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Error cargando sesión:", err);
        setUser(null);
      } finally {
        setLoading(false); // siempre quitamos el loading
      }
    };

    loadSession();

    // Suscripción a cambios de sesión
    const subscription = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (err) {
      console.error("Error cerrando sesión:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
