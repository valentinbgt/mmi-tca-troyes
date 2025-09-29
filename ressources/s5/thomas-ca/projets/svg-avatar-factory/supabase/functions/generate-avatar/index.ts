// Supabase Edge Function - generate-avatar
// Appelle Google Gemini API pour générer un avatar SVG
//
// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

Deno.serve(async (req: Request) => {
  try {
    // 1. Gérer la pré-vérification CORS (requête OPTIONS)
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204, // "No Content"
        headers: {
          "Access-Control-Allow-Origin": "*", // Autorise toutes les origines
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // 2. Traitement de la requête principale (POST)
    const { prompt } = await req.json();

    // 🔑 Clé Gemini API (stockée dans variables d'env supabase)
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("Missing GEMINI_API_KEY");

    // Initialiser Gemini AI
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const promptText =
      prompt ||
      `Crée un avatar SVG amusant et unique en 80x80 pixels, dans un style rétro gaming (pixel art, couleurs vives, effet 8-bit). L'avatar doit être différent de l'exemple fourni et varier en termes de couleur, de forme de cheveux et de vêtements.

      Réponds UNIQUEMENT avec la balise SVG, sans texte explicatif.

      Voici un exemple de sortie attendu :

      <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style="image-rendering: pixelated;">
        <rect width="80" height="80" fill="#2d2a4d" />
        <g id="body">
          <rect x="25" y="30" width="30" height="30" fill="#f5c2a1" />
        </g>
        <g id="clothes">
          <rect x="25" y="55" width="30" height="15" fill="#e82b3d" />
          <rect x="20" y="50" width="40" height="5" fill="#4a769d" />
        </g>
        <g id="hair">
          <rect x="20" y="25" width="40" height="10" fill="#fcd764" />
          <rect x="25" y="35" width="5" height="5" fill="#fcd764" />
          <rect x="50" y="35" width="5" height="5" fill="#fcd764" />
        </g>
        <g id="face">
          <rect x="30" y="40" width="5" height="5" fill="#000000" />
          <rect x="45" y="40" width="5" height="5" fill="#000000" />
          <rect x="35" y="50" width="10" height="5" fill="#e03b3b" />
        </g>
        <g id="hat">
          <rect x="30" y="15" width="20" height="10" fill="#e82b3d" />
          <rect x="25" y="20" width="30" height="5" fill="#e82b3d" />
          <rect x="30" y="15" width="20" height="5" fill="#ffffff" />
        </g>
      </svg>`;

    // Générer le contenu avec Gemini
    const result = await model.generateContent(promptText);
    const response = await result.response;
    // retirer fences markdown éventuels
    const svg = response
      .text()
      .replace(/```(svg|xml)?/gi, "")
      .trim();

    return new Response(JSON.stringify({ svg }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/generate-avatar' \
    --header 'Content-Type: application/json' \
    --data '{}'

*/
