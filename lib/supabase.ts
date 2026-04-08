import { createClient } from '@supabase/supabase-js';

// Env vars are injected at build time via GitHub Secrets (see deploy.yml).
// During local dev, copy .env.local.example → .env.local and fill in values.
// We fall back to placeholder strings so static export prerendering doesn't throw;
// the client will simply fail gracefully at runtime if vars are missing.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Store session in localStorage (client-side static export)
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
