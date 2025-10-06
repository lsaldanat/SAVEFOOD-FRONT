import { supabase } from "../lib/supabaseClient";

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
      emailRedirectTo: `${window.location.origin}/login`,
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