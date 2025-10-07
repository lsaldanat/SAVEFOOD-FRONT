import { useState } from "react";
import { login } from "../services/auth"; // 👈 importa la función de login

import { Link, useNavigate  } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";// 👈 importa el contexto
import { Eye, EyeOff } from "lucide-react"; // iconos de ojo

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 estado para mostrar/ocultar
  const [error, setError] = useState("");
  const { setUser } = useAuth(); // 👈 accedes a la función para actualizar usuario global
  const navigate = useNavigate(); // 👈 para redirigir después del login


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password); // 👈 reutilizando auth.js
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6">🛒 Iniciar Sesión</h2>

        <div className="flex flex-col gap-4">
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
            required/>

           <div className="relative">
            <input type={showPassword ? "text" : "password"} // 👈 alterna entre texto y password 
              placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required />
            
            <button
              type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              onClick={() => setShowPassword(!showPassword)} >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300">
            Entrar
          </button>
          
          {/* 👇 Enlace al registro */}
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center mt-2">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Regístrate aquí
            </Link>
          </p>

        </div>
      </form>
    </div>
  );
}
