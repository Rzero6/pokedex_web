export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  spriteBack?: string;
  spriteFront?: string;
  types: string[];
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

interface PokemonListItem {
  name: string;
  url: string;
}

class PokemonCache {
  private cache: Map<number | string, Pokemon> = new Map();
  private listCache: PokemonListItem[] = [];

  async getPokemon(idOrName: number | string): Promise<Pokemon | null> {
    const key = typeof idOrName === 'string' ? idOrName.toLowerCase() : idOrName;
    
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      const pokemon = this.transformPokemon(data);
      
      this.cache.set(pokemon.id, pokemon);
      this.cache.set(pokemon.name.toLowerCase(), pokemon);
      
      return pokemon;
    } catch (error) {
      console.error('Failed to fetch Pokemon:', error);
      return null;
    }
  }

  async getPokemonList(offset: number, limit: number): Promise<PokemonListItem[]> {
    if (this.listCache.length >= offset + limit) {
      return this.listCache.slice(offset, offset + limit);
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const data = await response.json();
      
      data.results.forEach((item: PokemonListItem, index: number) => {
        if (!this.listCache[offset + index]) {
          this.listCache[offset + index] = item;
        }
      });

      return data.results;
    } catch (error) {
      console.error('Failed to fetch Pokemon list:', error);
      return [];
    }
  }

  async getPokemonBatch(offset: number, limit: number): Promise<Pokemon[]> {
    const list = await this.getPokemonList(offset, limit);
    const pokemons: Pokemon[] = [];

    for (const item of list) {
      const id = this.extractIdFromUrl(item.url);
      const pokemon = await this.getPokemon(id);
      if (pokemon) {
        pokemons.push(pokemon);
      }
    }

    return pokemons;
  }

  private extractIdFromUrl(url: string): number {
    const parts = url.split('/').filter(Boolean);
    return parseInt(parts[parts.length - 1], 10);
  }

  private transformPokemon(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      sprite: data.sprites.other?.['official-artwork']?.front_default || 
              data.sprites.front_default,
      spriteBack: data.sprites.back_default,
      spriteFront: data.sprites.front_default,
      types: data.types.map((t: any) => t.type.name),
      height: data.height,
      weight: data.weight,
      stats: {
        hp: data.stats[0].base_stat,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        specialAttack: data.stats[3].base_stat,
        specialDefense: data.stats[4].base_stat,
        speed: data.stats[5].base_stat,
      },
    };
  }

  isInCache(idOrName: number | string): boolean {
    const key = typeof idOrName === 'string' ? idOrName.toLowerCase() : idOrName;
    return this.cache.has(key);
  }
}

export const pokemonCache = new PokemonCache();

const pokemonMoves: string[] =
[
  "Tackle",
  "Quick Attack",
  "Iron Tail",
  "Slap",
  "Scratch",
]

export function getRandomMove(): string {
  const index = Math.floor(Math.random() * pokemonMoves.length);
  return pokemonMoves[index];
}