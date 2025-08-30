import { useState } from "react";
const generateAvatarUrl = import.meta.env.PUBLIC_FUNCTION_GENERATE_AVATAR_URL;

export default function AvatarGenerator() {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="border border-green-500 p-4 rounded-xl">
      <h2 className="text-xl mb-2">🎨 Générateur d’avatars</h2>

      <div className="bg-black border border-green-700 h-40 flex items-center justify-center overflow-auto p-2">
        {loading && <p>⏳ Génération...</p>}
        {!loading && svg && <div dangerouslySetInnerHTML={{ __html: svg }} />}
        {!loading && !svg && <p>Aucun avatar généré</p>}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={generate} className="bg-green-700 px-4 py-2 rounded">
          Générer un avatar
        </button>
        {svg && (
          <button
            onClick={copyToClipboard}
            className="bg-green-900 px-4 py-2 rounded"
          >
            Copier le SVG
          </button>
        )}
      </div>
    </div>
  );
}
