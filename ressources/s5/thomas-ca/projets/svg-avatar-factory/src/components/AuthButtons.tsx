import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const appBaseUrl = import.meta.env.PUBLIC_APP_URL;

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
        redirectTo: appBaseUrl,
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading)
    return (
      <button
        style={{
          backgroundColor: "#706fd3",
          color: "#ffda79",
          border: "2px solid #ffda79",
          padding: "8px 16px",
          fontFamily: "Courier New, monospace",
          fontSize: "12px",
          borderRadius: "4px",
          opacity: 0.6,
        }}
      >
        Chargement...
      </button>
    );

  return user ? (
    <div className="flex items-center gap-2">
      <span style={{ color: "#ffda79", fontSize: "12px" }}>
        Connecté : {user.email}
      </span>
      <button
        onClick={logout}
        style={{
          backgroundColor: "#ff5252",
          color: "white",
          border: "none",
          padding: "8px 16px",
          fontFamily: "Courier New, monospace",
          fontSize: "12px",
          cursor: "pointer",
          borderRadius: "4px",
          transition: "all 0.3s",
          boxShadow: "0 2px 0 #b33939",
          textTransform: "uppercase",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#ff3838";
          e.currentTarget.style.transform = "translateY(1px)";
          e.currentTarget.style.boxShadow = "0 1px 0 #b33939";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#ff5252";
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "0 2px 0 #b33939";
        }}
      >
        Se déconnecter
      </button>
    </div>
  ) : (
    <button
      onClick={loginWithGoogle}
      style={{
        backgroundColor: "#34ace0",
        color: "white",
        border: "none",
        padding: "10px 20px",
        fontFamily: "Courier New, monospace",
        fontSize: "14px",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "all 0.3s",
        boxShadow: "0 4px 0 #227093",
        textTransform: "uppercase",
        fontWeight: "bold",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#2980b9";
        e.currentTarget.style.transform = "translateY(2px)";
        e.currentTarget.style.boxShadow = "0 2px 0 #227093";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#34ace0";
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "0 4px 0 #227093";
      }}
    >
      Login with Google
    </button>
  );
}
