import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;

export default function AuthButtons() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          supabaseUrl +
          "/mmi-tca-troyes/s5/thomas-ca/projets/svg-avatar-factory/",
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading)
    return (
      <button className="bg-green-900 px-4 py-2 rounded opacity-60">
        Chargement...
      </button>
    );

  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-sm">Connecté : {user.email}</span>
      <button onClick={logout} className="bg-green-900 px-3 py-2 rounded">
        Se déconnecter
      </button>
    </div>
  ) : (
    <button
      onClick={loginWithGoogle}
      className="bg-green-900 px-4 py-2 rounded"
    >
      Login with Google
    </button>
  );
}
