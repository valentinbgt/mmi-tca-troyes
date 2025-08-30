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

  if (!userId) return <p>Connectez-vous pour voir vos favoris.</p>;

  if (items.length === 0) return <p>Aucun favori enregistré.</p>;

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="border border-green-700 rounded p-3 bg-black"
        >
          <div
            className="mb-2 max-h-40 overflow-auto"
            dangerouslySetInnerHTML={{ __html: item.svg }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => copy(item.svg)}
              className="bg-green-700 px-3 py-1 rounded"
            >
              Copier
            </button>
            <button
              onClick={() => remove(item.id)}
              className="bg-red-900 px-3 py-1 rounded"
            >
              🗑 Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
