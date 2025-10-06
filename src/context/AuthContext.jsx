// context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { 
  getCurrentSession,
  logout,
  onAuthStateChange
} from "../services/auth";


// ✅ Contexto global de autenticación
export const AuthContext  = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al iniciar la app, comprobar si hay sesión
  useEffect(() => {

    // ✅ Revisar si ya había sesión iniciada
    // ✅ Sesión inicial
    getCurrentSession().then((session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    

    // Escuchar cambios de sesión (login/logout)
    // Suscribirse a cambios de sesión
    // ✅ Escuchar cambios (login / logout)
    // ✅ Suscripción a cambios de sesión
    const subscription = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // ✅ Limpiar suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

   const handleLogout = async () => {
    await logout();
    setUser(null);
  };


   return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}


