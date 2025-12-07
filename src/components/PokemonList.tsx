import { useEffect, useRef, useCallback } from "react";
import { type Pokemon } from "../lib/pokemonCache";
import { ScrollArea } from "./ui/scroll-area";

interface PokemonListProps {
  pokemons: Pokemon[];
  selectedId: number | null;
  onSelect: (pokemon: Pokemon) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  scrollToId?: number | null;
}

export function PokemonList({
  pokemons,
  selectedId,
  onSelect,
  onLoadMore,
  hasMore,
  isLoading,
  scrollToId,
}: PokemonListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const setItemRef = useCallback((id: number, el: HTMLButtonElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  // Scroll to item when scrollToId changes
  useEffect(() => {
    if (scrollToId && itemRefs.current.has(scrollToId)) {
      const element = itemRefs.current.get(scrollToId);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollToId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 pr-2">
        {pokemons.map((pokemon) => (
          <button
            key={pokemon.id}
            ref={(el) => setItemRef(pokemon.id, el)}
            onClick={() => onSelect(pokemon)}
            className={`w-full text-left p-2 rounded transition-all text-[10px] md:text-xs ${
              selectedId === pokemon.id
                ? "bg-pokedex-lcd text-pokedex-lcd-text"
                : "bg-pokedex-screen-dark hover:bg-pokedex-lcd/50 text-gray-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="uppercase truncate">{pokemon.name}</span>
              <span className="text-[8px] md:text-[10px] opacity-70">
                #{pokemon.id.toString().padStart(3, "0")}
              </span>
            </div>
          </button>
        ))}

        {/* Load more trigger */}
        <div ref={loadMoreRef} className="h-8 flex items-center justify-center">
          {isLoading && (
            <span className="text-[10px] text-gray-600 animate-pulse">
              LOADING MORE...
            </span>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
