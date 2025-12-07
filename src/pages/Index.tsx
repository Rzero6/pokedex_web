import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PokedexFrame } from "../components/PokedexFrame";
import { PokemonPreview } from "../components/PokemonPreview";
import { PokemonList } from "../components/PokemonList";
import { PokedexSearch } from "../components/PokedexSearch";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { pokemonCache, type Pokemon } from "../lib/pokemonCache";
import { useToast } from "../hooks/use-toast";

const BATCH_SIZE = 20;

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [scrollToId, setScrollToId] = useState<number | null>(null);

  const loadPokemons = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const batch = await pokemonCache.getPokemonBatch(offset, BATCH_SIZE);
      if (batch.length < BATCH_SIZE) {
        setHasMore(false);
      }
      setPokemons((prev) => {
        const existingIds = new Set(prev.map(p => p.id));
        const newPokemons = batch.filter(p => !existingIds.has(p.id));
        return [...prev, ...newPokemons];
      });
      setOffset((prev) => prev + BATCH_SIZE);

      // Select first pokemon if none selected
      if (!selectedPokemon && batch.length > 0) {
        setSelectedPokemon(batch[0]);
      }
    } catch (error) {
      console.error("Failed to load pokemons:", error);
      toast({
        title: "Error",
        description: "Failed to load Pokémon data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading, hasMore, selectedPokemon, toast]);

  useEffect(() => {
    loadPokemons();
  }, []); // Initial load only

  const handleSearch = async (query: string) => {
    setIsSearching(true);

    // Check if it's a number
    const isNumber = /^\d+$/.test(query);
    const searchKey = isNumber ? parseInt(query, 10) : query.toLowerCase();

    // Fetch pokemon (cache handles optimization)
    const pokemon = await pokemonCache.getPokemon(searchKey);
    if (pokemon) {
      setSelectedPokemon(pokemon);
      // Add to list if not already there, or just scroll to it
      setPokemons((prev) => {
        if (prev.some(p => p.id === pokemon.id)) return prev;
        return [pokemon, ...prev];
      });
      // Trigger scroll to the found pokemon
      setScrollToId(pokemon.id);
    } else {
      toast({
        title: "Not Found",
        description: `No Pokémon found for "${query}"`,
        variant: "destructive",
      });
    }
    setIsSearching(false);
  };

  const handleSelect = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleChooseClick = () => {
    if (selectedPokemon) {
      setShowConfirm(true);
    }
  };

  const handleConfirm = () => {
    if (selectedPokemon) {
      navigate(`/battle/${selectedPokemon.id}`);
    }
  };

  return (
    <>
      <PokedexFrame>
        <div className="flex flex-col h-[70vh] md:h-[60vh]">
          <div className="mb-4">
            <PokedexSearch onSearch={handleSearch} isSearching={isSearching} />
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">

            {/* Left (Image) */}
            <div className="w-full md:w-3/5 h-[60%] md:h-full">
              <PokemonPreview pokemon={selectedPokemon} isLoading={isSearching} />
            </div>

            {/* Right Column */}
            <div className="w-full md:w-2/5 h-[40%] md:h-full flex flex-col gap-2">

              {/* Top (List) */}
              <div className="flex-1 overflow-hidden bg-pokedex-screen-dark rounded-lg p-2">
                <PokemonList
                  pokemons={pokemons}
                  selectedId={selectedPokemon?.id || null}
                  onSelect={handleSelect}
                  onLoadMore={loadPokemons}
                  hasMore={hasMore}
                  isLoading={isLoading}
                  scrollToId={scrollToId}
                />
              </div>

              {/* Bottom (Button) */}
              <div className="w-full flex justify-center">
                <button
                  onClick={handleChooseClick}
                  disabled={!selectedPokemon}
                  className="w-full bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed
                   text-accent-foreground px-6 py-3 rounded-lg text-xs md:text-base lg:text-base 
                   transition-all hover:scale-105 active:scale-95"
                >
                  CHOOSE POKEMON
                </button>
              </div>

            </div>
          </div>



        </div>
      </PokedexFrame>

      <ConfirmDialog
        pokemon={selectedPokemon}
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
};

export default Index;
