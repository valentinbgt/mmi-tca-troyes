import { createClient } from "@supabase/supabase-js";

// ⚠️ Ces valeurs sont publiques côté client (Anon Key publique)
export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL!,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce", // PKCE = safe pour SPA
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
