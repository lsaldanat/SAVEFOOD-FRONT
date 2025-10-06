import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👈 si usas lucide-react
import { register } from "../services/auth";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 estado para el toggle
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await register(email, password);
      setSuccess("Revisa tu correo para confirmar tu cuenta ✅");
    } catch (err) {
      setError(err.message);
    }

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Revisa tu correo para confirmar tu cuenta ✅");
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        <h2 className="text-2xl font-bold text-center text-white mb-6">📝 Crear Cuenta</h2>

        <div className="flex flex-col gap-4">
          
          <input
            type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400"
            required />



          {/* Campo contraseña con botón de ojo */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-green-500 focus:outline-none placeholder-gray-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button
            type="submit"
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg transition duration-300 shadow-md hover:shadow-green-500/30">
            Registrarme
          </button>
        </div>
      </form>
      
    </div>
  );
}
