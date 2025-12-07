import { type Pokemon } from "../lib/pokemonCache";

interface PokemonPreviewProps {
  pokemon: Pokemon | null;
  isLoading?: boolean;
}

const typeColors: Record<string, string> = {
  normal: "bg-gray-400",
  fire: "bg-orange-500",
  water: "bg-blue-500",
  electric: "bg-yellow-400",
  grass: "bg-green-500",
  ice: "bg-cyan-300",
  fighting: "bg-red-700",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  flying: "bg-indigo-300",
  psychic: "bg-pink-500",
  bug: "bg-lime-500",
  rock: "bg-amber-700",
  ghost: "bg-purple-700",
  dragon: "bg-indigo-600",
  dark: "bg-gray-700",
  steel: "bg-gray-400",
  fairy: "bg-pink-300",
};

export function PokemonPreview({ pokemon, isLoading }: PokemonPreviewProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-pokedex-lcd-text text-xs animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-pokedex-lcd-text text-xs">
          SELECT A POKEMON
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Pokemon Image */}
      <div className="h-[60%] flex-1 flex items-center justify-center bg-pokedex-lcd rounded-lg p-4 mb-3">
        <img
          src={pokemon.sprite}
          alt={pokemon.name}
          className="max-w-[80px] sm:max-w-[100px] md:max-w-[200px] lg:max-w-[250px] w-full h-auto object-contain animate-bounce-in drop-shadow-lg"
        />
      </div>

      {/* Pokemon Info */}
      <div className="h-[40%] bg-pokedex-lcd rounded-lg p-3 text-pokedex-lcd-text justify-evenly flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] md:text-xs uppercase">{pokemon.name}</span>
          <span className="text-[10px] md:text-xs">#{pokemon.id.toString().padStart(3, "0")}</span>
        </div>

        {/* Types */}
        <div className="flex gap-2 mb-2">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`text-[8px] md:text-[10px] px-2 py-0.5 rounded uppercase text-white ${typeColors[type] || "bg-gray-500"
                }`}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Stats preview */}
        <div className="flex justify-between text-[8px] md:text-[10px]">
          <div>Height: {(pokemon.height / 10).toFixed(1)}m</div>
          <div>Weight: {(pokemon.weight / 10).toFixed(1)}kg</div>
        </div>
      </div>
    </div>
  );
}
