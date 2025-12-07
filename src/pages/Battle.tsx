import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pokemonCache, type Pokemon } from "../lib/pokemonCache";
import { ArrowLeft } from "lucide-react";
import { getRandomMove } from "../lib/pokemonCache";

export default function Battle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayerAttack, setShowPlayerAttack] = useState(false);
  const [showEnemyAttack, setShowEnemyAttack] = useState(false);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerAttack, setPlayerAttack] = useState(10);
  const [enemyHp, setEnemyHp] = useState(100);
  const [battleMessage, setBattleMessage] = useState("");
  const [isAttacking, setIsAttacking] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState(false);

  useEffect(() => {
    const loadPokemon = async () => {
      if (!id) return;
      const data = await pokemonCache.getPokemon(parseInt(id, 10));
      setPokemon(data);
      setPlayerHp(data?.stats.hp || 100);
      setEnemyHp(data?.stats.hp || 100);
      setPlayerAttack(data?.stats.attack || 10);

      setIsLoading(false);
    };
    loadPokemon();
  }, [id]);

  useEffect(() => {
    if (!pokemon) return;

    if (enemyHp <= 0 && !gameOver) {
      setGameOver(true);
      setGameResult(true);
      setBattleMessage(`YOU DEFEATED ${pokemon.name.toUpperCase()}!`);
    }

    if (playerHp <= 0 && !gameOver) {
      setGameOver(true);
      setGameResult(false);
      setBattleMessage(`${pokemon.name.toUpperCase()} FAINTED...`);
    }
  }, [enemyHp, playerHp, pokemon, gameOver]);


  const handleAttack = () => {
    if (isAttacking || !pokemon) return;

    setIsAttacking(true);
    setShowPlayerAttack(true);

    // Calculate damage
    const min = playerAttack - 3;
    const max = playerAttack + 3;
    const damage = (Math.floor(Math.random() * (max - min + 1)) + min - Math.floor(pokemon.stats.defense / 2));
    setBattleMessage(`${pokemon.name.toUpperCase()} used ${getRandomMove()}!`);

    setTimeout(() => {
      setShowPlayerAttack(false);
      setEnemyHp(prev => Math.max(0, prev - damage));
      setBattleMessage(`It dealt ${damage} damage!`);
      if (enemyHp - damage <= 0) {
        setIsAttacking(false);
        return;
      }

      // Enemy counter attack
      setTimeout(() => {
        setShowEnemyAttack(true);
        const enemyDamage = (Math.floor(Math.random() * (max - min + 1)) + min - Math.floor(pokemon.stats.defense / 2));
        setBattleMessage(`Wild ${pokemon.name.toUpperCase()} used ${getRandomMove()}!`);
        setBattleMessage(`It dealt ${damage} damage!`);

        setTimeout(() => {
          setShowEnemyAttack(false);
          setPlayerHp(prev => Math.max(0, prev - enemyDamage));

          setBattleMessage(`What will ${pokemon.name.toUpperCase()} do?`);
          setIsAttacking(false);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-pixel">
        <div className="text-accent text-sm animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-pixel">
        <div className="text-destructive text-sm">POKEMON NOT FOUND</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pokedex-screen font-pixel overflow-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-2 left-2 z-20 bg-primary hover:bg-primary/80 text-primary-foreground p-1.5 rounded transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Battle Scene Container */}
      <div className="relative w-full h-screen flex flex-col">

        {/* Top Section - Battle Field */}
        <div className="flex-1 relative bg-gradient-to-b from-sky-300 to-sky-200">


          {/* Enemy Pokemon */}
          <div className="absolute top-1/4 right-1/4  flex flex-col items-center">
            <div className=" bg-pokedex-lcd border-2 border-gray-800 rounded px-3 py-2 min-w-[160px] md:min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] md:text-xs text-pokedex-lcd-text uppercase">Wild {pokemon.name}</span>
                {/* <span className="text-[8px] md:text-[10px] text-gray-600">Lv50</span> */}
              </div>
              {/* Enemy HP Bar*/}
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-accent font-bold">HP</span>
                <div className="flex-1 h-2 bg-gray-wh rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${enemyHp / pokemon.stats.hp * 100 > 50 ? 'bg-green-500'
                      : enemyHp / pokemon.stats.hp * 100 > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${enemyHp / pokemon.stats.hp * 100}%` }}
                  />
                </div>
                <div className={`text-right text-[10px] ${enemyHp / pokemon.stats.hp * 100 > 50 ? 'text-pokedex-lcd-text'
                  : enemyHp / pokemon.stats.hp * 100 > 20 ? 'text-pokedex-highlight' : 'text-pokedex-red'} mt-0.5`}>
                  {enemyHp}/{pokemon.stats.hp}
                </div>
              </div>
            </div>
            <div className="md:right-16">
              <div className={`${showEnemyAttack ? "animate-battle-shake" : ""}
                ${showPlayerAttack ? "animate-spin" : ""}`}>
                <img
                  src={pokemon.spriteFront}
                  alt="Enemy"
                  className="w-48 md:w-64 h-48 md:h-64 object-contain pixelated"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>

          {/* Player Pokemon */}
          <div className="absolute bottom-1/4 left-1/4 flex flex-col items-center">
            {/* Player HP Bar */}
            <div className=" bg-pokedex-lcd border-2 border-gray-800 rounded px-3 py-2 min-w-[160px] md:min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] md:text-xs text-pokedex-lcd-text uppercase">{pokemon.name}</span>
                {/* <span className="text-[8px] md:text-[10px] text-gray-600">Lv100</span> */}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-yellow-600 font-bold">HP</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${playerHp / pokemon.stats.hp * 100 > 50 ? 'bg-green-500'
                      : playerHp / pokemon.stats.hp * 100 > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${playerHp / pokemon.stats.hp * 100}%` }}
                  />
                </div>
              </div>
              <div className={`text-right text-[10px] ${playerHp / pokemon.stats.hp * 100 > 50 ? 'text-pokedex-lcd-text'
                : playerHp / pokemon.stats.hp * 100 > 20 ? 'text-pokedex-highlight' : 'text-pokedex-red'} mt-0.5`}>
                {playerHp}/{pokemon.stats.hp}
              </div>
            </div>

            <div className="md:left-16">
              <div className={`${showPlayerAttack ? "animate-battle-shake" : ""} 
                ${showEnemyAttack ? "animate-spin" : ""}`}>
                <img
                  src={pokemon.spriteBack}
                  alt={pokemon.name}
                  className="w-48 md:w-64 h-48 md:h-64 object-contain pixelated"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            </div>
          </div>
        </div>
        {gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-pokedex-screen-dark border-4 border-gray-900 rounded-xl p-6 text-center w-60">
              <h2 className={`text-lg font-bold mb-3 ${gameResult ? 'text-pokedex-lcd-text' : 'text-pokedex-dark-red'}`}>
                {gameResult ? "VICTORY!" : "YOU LOST!"}
              </h2>
              <p className="text-xs text-black mb-4">
                {gameResult
                  ? `${pokemon.name.toUpperCase()} fainted!`
                  : `${pokemon.name.toUpperCase()} couldn’t fight anymore...`}
              </p>

              <button
                onClick={() => navigate("/")}
                className="bg-purple-500 hover:bg-purple-400 text-white py-2 px-4 rounded border-2 border-purple-700 text-xs uppercase"
              >
                Return
              </button>
            </div>
          </div>
        )}

        {/* Bottom Section - Battle Menu */}
        <div className="bg-pokedex-red border-t-4 border-pokedex-dark-red p-3 md:p-4">
          <div className="flex gap-2 md:gap-4 max-w-4xl mx-auto">
            {/* Message box */}
            <div className="flex-1 bg-pokedex-lcd border-2 border-pokedex-dark-red rounded p-2 md:p-5">
              <p className="text-[10px] md:text-xs text-pokedex-lcd-text">
                {battleMessage || `What will ${pokemon.name.toUpperCase()} do?`}
              </p>
            </div>
            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 w-[140px] md:w-[180px]">
              <button
                onClick={handleAttack}
                disabled={isAttacking}
                className="bg-pokedex-blue text-white py-1.5 md:py-2 px-2 md:px-3 rounded border-2 border-white text-[9px] md:text-[10px] uppercase transition-all hover:scale-105 active:scale-95 disabled:scale-100"
              >
                Fight
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-pokedex-highlight text-black py-1.5 md:py-2 px-2 md:px-3 rounded border-2 border-black text-[9px] md:text-[10px] uppercase transition-all hover:scale-105 active:scale-95"
              >
                Run
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
