import { useState } from "react";

interface PokedexSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

export function PokedexSearch({ onSearch, isSearching }: PokedexSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="NAME OR #"
          className="w-full bg-pokedex-lcd text-pokedex-lcd-text placeholder:text-pokedex-lcd-text/50 rounded px-3 py-2 text-[10px] md:text-xs uppercase focus:outline-none focus:ring-2 focus:ring-pokedex-highlight"
        />
      </div>
      <button
        type="submit"
        disabled={isSearching || !query.trim()}
        className="bg-pokedex-blue hover:bg-pokedex-blue/80 disabled:opacity-50 text-white rounded px-3 py-2
         text-xs transition-all hover:scale-105 active:scale-95"
      >
        SEARCH
      </button>
    </form>
  );
}
