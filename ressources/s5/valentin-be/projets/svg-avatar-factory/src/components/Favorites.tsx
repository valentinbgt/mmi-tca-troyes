import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Favorite {
  id: string;
  svg: string;
  created_at: string;
}

export default function Favorites() {
  const [items, setItems] = useState<Favorite[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) await load();
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) load();
      else setItems([]);
    });

    // Écouter l'événement favoriteAdded pour rafraîchir la liste
    const handleFavoriteAdded = () => {
      if (userId) load();
    };
    window.addEventListener("favoriteAdded", handleFavoriteAdded);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("favoriteAdded", handleFavoriteAdded);
    };
  }, [userId]);

  async function load() {
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setItems(data as Favorite[]);
  }

  async function remove(id: string) {
    const { error } = await supabase.from("favorites").delete().eq("id", id);
    if (!error) setItems((items) => items.filter((i) => i.id !== id));
  }

  function copy(svg: string) {
    navigator.clipboard.writeText(svg);
    alert("SVG copié !");
  }

  if (!userId)
    return (
      <p style={{ color: "#ffda79", fontStyle: "italic" }}>
        Connectez-vous pour voir vos favoris.
      </p>
    );

  if (items.length === 0)
    return (
      <p style={{ color: "#ffda79", fontStyle: "italic" }}>
        Aucun favori enregistré.
      </p>
    );

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            backgroundColor: "#40407a",
            border: "2px solid #ffda79",
            borderRadius: "8px",
            padding: "15px",
          }}
        >
          <div
            style={{
              marginBottom: "15px",
              maxHeight: "120px",
              overflow: "auto",
              backgroundColor: "#2c2c54",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #706fd3",
              imageRendering: "pixelated",
            }}
            dangerouslySetInnerHTML={{ __html: item.svg }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => copy(item.svg)}
              style={{
                backgroundColor: "#33d9b2",
                color: "white",
                border: "none",
                padding: "8px 16px",
                fontFamily: "Courier New, monospace",
                fontSize: "12px",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.3s",
                boxShadow: "0 2px 0 #26a085",
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#2bcca7";
                e.currentTarget.style.transform = "translateY(1px)";
                e.currentTarget.style.boxShadow = "0 1px 0 #26a085";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#33d9b2";
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 2px 0 #26a085";
              }}
            >
              Copier
            </button>
            <button
              onClick={() => remove(item.id)}
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
                fontWeight: "bold",
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
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
