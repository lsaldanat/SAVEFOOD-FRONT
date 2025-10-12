import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { changePasswordWithValidation  } from "../../services/auth";


export default function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados independientes para cada input
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState({ text: "", type: "" });
  
  

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Las contraseñas no coinciden ❌", type: "error" });
      return;
    }

    // if (newPassword.length < 6) {
    //   setError("La nueva contraseña debe tener al menos 6 caracteres 🔒");
    //   return;
    // }

    try {
      // 🔹 Supabase no requiere contraseña actual (según la sesión)
      const result = await changePasswordWithValidation(oldPassword, newPassword);
      setMessage({ text: result, type: "success" });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setMessage({ text: err.message, type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <form
        onSubmit={handleUpdatePassword}
        className="bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center gap-2">
          <Lock size={24} /> Cambiar Contraseña
        </h2>

        <div className="space-y-4">
          
          {/* Contraseña actual */}
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">Contraseña actual</label>
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Contraseña actual"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
              required/>



              {/* 👁 Toggle show/hide */}
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white">
              {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>


          </div>


          {/* Nueva contraseña */}
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">
              Nueva contraseña
            </label>
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 pr-10"
              required/>

             {/* 👁 Toggle show/hide */}
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white">
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <label className="block text-sm text-gray-300 mb-1">
              Confirmar contraseña
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 pr-10"
              required
            />

            
            {/* 👁 Toggle show/hide */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-white">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>


            
          </div>

          {message.text && (
            <p
                className={`text-center text-sm mb-3 ${
                message.type === "error" ? "text-red-400" : "text-green-400"
                }`}
            >
                {message.text}
            </p>
        )}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition duration-300 shadow-md hover:shadow-blue-500/30">
            Actualizar contraseña
          </button>

          {/* <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold p-3 rounded-lg transition duration-300">
            ← Volver
          </button> */}
        
        </div>
      </form>
    </div>
  );
}
