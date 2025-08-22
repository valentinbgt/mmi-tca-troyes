    // src/App.tsx
    function App() {
      return (
        <div className="min-h-screen bg-black text-lime-400 font-mono p-4">
    
          {/* Header */}
          <header className="fixed top-0 left-0 right-0 p-4 border-b-2 border-lime-400 flex justify-between items-center z-10 bg-black">
            <h1 className="text-2xl md:text-4xl font-bold animate-pulse">
              ASCII Avatar Factory
            </h1>
            <button
              className="px-4 py-2 border-2 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black transition-colors duration-200 cursor-not-allowed"
              disabled
            >
              Login with Google
            </button>
          </header>
    
          {/* Main content area */}
          <main className="pt-24 pb-8 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
    
            {/* Left column - Avatar Generator */}
            <section className="w-full md:w-1/2 flex flex-col items-center">
              <div className="w-full max-w-md h-64 bg-black border-2 border-lime-400 text-lime-400 p-4 flex items-center justify-center font-mono">
                <span className="text-sm text-center">
                  Le futur avatar ASCII s'affichera ici.
                </span>
              </div>
              <button
                className="mt-4 px-6 py-3 border-2 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-black transition-colors duration-200 cursor-not-allowed"
                disabled
              >
                🎲 Générer un avatar
              </button>
            </section>
    
            {/* Right column - Favorites */}
            <section className="w-full md:w-1/2 mt-8 md:mt-0">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                ⭐ Mes Favoris
              </h2>
              <div className="border-2 border-lime-400 p-4 h-64 overflow-y-auto">
                <p className="text-sm">
                  Connectez-vous pour sauvegarder vos avatars préférés.
                </p>
              </div>
            </section>
          </main>
    
          {/* Footer */}
          <footer className="mt-8 text-center text-xs text-lime-400">
            Fait à Troyes avec ❤️ par [Nom Étudiant] — Avatars généré par Llama-3.1-8b-instant
          </footer>
    
        </div>
      );
    }
    
    export default App;
