
import { createClient } from '@supabase/supabase-js';

// Access environment variables safely.
// We cast import.meta to any to avoid TypeScript errors if vite/client types are missing.
const env = (import.meta as any).env || {};

// Fallbacks for when .env is not loaded correctly
const FALLBACK_URL = "https://iquantqgsrgwbqfwbhfq.supabase.co";
const FALLBACK_KEY = "sb_publishable_5LjSKfbZIrnPTm-7do--Eg_2rZIvmBP";

const supabaseUrl = env.VITE_PUBLIC_SUPABASE_URL || FALLBACK_URL;
const supabaseAnonKey = env.VITE_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URLs missing. Check .env file.");
  throw new Error("Supabase URLs missing. Check .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
