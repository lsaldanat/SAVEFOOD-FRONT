import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentSession, onAuthStateChange } from "../services/auth";  

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const checkSession = async () => {
      try {
        const session = await getCurrentSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error obteniendo sesión:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
    
    // Escuchar cambios de sesión
    const { subscription } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      // Ahora se usa remove()
      subscription?.remove();
    };
  }, []);

  if (loading) return <p className="text-center mt-10">Verificando sesión...</p>;

  return user ? children : <Navigate to="/login" replace />;
}
