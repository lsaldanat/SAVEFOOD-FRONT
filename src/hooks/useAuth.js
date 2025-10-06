import { useContext } from "react";
import { AuthContext } from "../context/authContext";

// ✅ Hook para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  //return useContext(AuthContext);
  return context;
}
