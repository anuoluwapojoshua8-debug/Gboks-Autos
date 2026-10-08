import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Supabase is the production backend (Step 2+ wires real tables).
// If env vars are missing (local dev / preview), we return null and the
// UI falls back to local demo data + localStorage so the site still works.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anon ? createClient(url, anon) : null;

export const isSupabaseConfigured = () => supabase !== null;
