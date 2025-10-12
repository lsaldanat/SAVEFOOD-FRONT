import { supabase } from "../lib/supabaseClient";


// 🔹 URL base según entorno
const baseUrl = import.meta.env.VITE_APP_URL;


// Obtener sesión actual
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Iniciar sesión
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data.user;
}

// 🔹 Registrar usuario
export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //emailRedirectTo: `${window.location.origin}/login`,
      emailRedirectTo: `${baseUrl}/login`, // usa la variable aquí
    },
  });
  if (error) throw error;
  return data;
}


// Cerrar sesión
export async function logout() {  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// services/auth.js
export function onAuthStateChange(callback) {
  // devuelve la suscripción real
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}

// Actualizar contraseña
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (error) throw error;
}

export async function changePasswordWithValidation(oldPassword, newPassword) {
  // Obtener usuario actual
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Usuario no autenticado");

  // Verificar contraseña anterior
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: oldPassword,
  });
  if (loginError) throw new Error("La contraseña actual es incorrecta ❌");

  // Actualizar a la nueva contraseña
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  if (updateError) throw updateError;

  return "Contraseña actualizada correctamente ✅";
}