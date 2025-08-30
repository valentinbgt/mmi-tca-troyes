import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const generateAvatarUrl = import.meta.env.PUBLIC_FUNCTION_GENERATE_AVATAR_URL;

export default function AvatarGenerator() {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  async function generate() {
    setLoading(true);
    setSvg(null);

    const res = await fetch(generateAvatarUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const data = await res.json();
    setSvg(data.svg);
    setLoading(false);
  }

  function copyToClipboard() {
    if (svg) {
      navigator.clipboard.writeText(svg);
    }
  }

  const handleAddFavorite = async () => {
    if (!user) return; // sécurité : pas d'utilisateur => on arrête

    try {
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id, // qui a ajouté le favori
        svg: svg, // le code SVG à sauvegarder
      });

      if (error) throw error;

      // Émettre un événement personnalisé pour notifier les autres composants
      window.dispatchEvent(new CustomEvent("favoriteAdded"));
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'ajout en favoris");
    }
  };

  return (
    <div
      className="retro-block"
      style={{
        backgroundColor: "#706fd3",
        border: "4px solid #ffda79",
        borderRadius: "8px",
        padding: "20px",
        color: "#ffda79",
      }}
    >
      <h2
        style={{
          color: "#ffda79",
          fontSize: "1.5rem",
          marginBottom: "15px",
          textTransform: "uppercase",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        🎨 Générateur d'avatars
      </h2>

      <div
        className="avatar-container"
        style={{
          backgroundColor: "#40407a",
          border: "4px solid #ffda79",
          borderRadius: "8px",
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "auto",
          padding: "20px",
          marginBottom: "20px",
          imageRendering: "pixelated",
        }}
      >
        {loading && <p style={{ color: "#ffda79" }}>⏳ Génération...</p>}
        {!loading && svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
        {!loading && !svg && (
          <p style={{ color: "#ffda79" }}>Aucun avatar généré</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={generate}
          style={{
            backgroundColor: "#ff5252",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontFamily: "Courier New, monospace",
            fontSize: "14px",
            cursor: "pointer",
            borderRadius: "4px",
            transition: "all 0.3s",
            boxShadow: "0 4px 0 #b33939",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#ff3838";
            e.currentTarget.style.transform = "translateY(2px)";
            e.currentTarget.style.boxShadow = "0 2px 0 #b33939";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ff5252";
            e.currentTarget.style.transform = "translateY(0px)";
            e.currentTarget.style.boxShadow = "0 4px 0 #b33939";
          }}
        >
          Générer un avatar
        </button>
        {svg && (
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: "#33d9b2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              fontFamily: "Courier New, monospace",
              fontSize: "14px",
              cursor: "pointer",
              borderRadius: "4px",
              transition: "all 0.3s",
              boxShadow: "0 4px 0 #26a085",
              textTransform: "uppercase",
              fontWeight: "bold",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2bcca7";
              e.currentTarget.style.transform = "translateY(2px)";
              e.currentTarget.style.boxShadow = "0 2px 0 #26a085";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#33d9b2";
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "0 4px 0 #26a085";
            }}
          >
            Copier le SVG
          </button>
        )}
        {svg &&
          (user ? (
            <button
              onClick={handleAddFavorite}
              disabled={!svg}
              style={{
                backgroundColor: "#ffb142",
                color: "white",
                border: "none",
                padding: "12px 24px",
                fontFamily: "Courier New, monospace",
                fontSize: "14px",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.3s",
                boxShadow: "0 4px 0 #d49132",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#ffa726";
                e.currentTarget.style.transform = "translateY(2px)";
                e.currentTarget.style.boxShadow = "0 2px 0 #d49132";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#ffb142";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 4px 0 #d49132";
              }}
            >
              ⭐ Favori
            </button>
          ) : (
            <p
              style={{
                color: "#ffda79",
                alignSelf: "center",
                fontSize: "14px",
                fontStyle: "italic",
              }}
            >
              Connectez-vous pour sauvegarder
            </p>
          ))}
      </div>
    </div>
  );
}
