import { createClient } from '@supabase/supabase-js'

// Estos valores los sacas de tu proyecto Supabase
const SUPABASE_URL = "https://gfirddmriuknvgxnqexj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmaXJkZG1yaXVrbnZneG5xZXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MDMyMjYsImV4cCI6MjA3NDE3OTIyNn0.HZ-UNeN6wHWgliXIO8CsoSCmPPWIrWknw2H2UnAB4RY";


// ✅ instancia única
export const supabase = window.supabase ?? createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// guardarlo en window para evitar múltiples instancias en dev
if (!window.supabase) window.supabase = supabase;


// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// export default supabase

