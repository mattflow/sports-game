import { useState } from "react";
import type { useGame } from "../hooks/useGame";
import CheatSheet from "./CheatSheet";

const GameOverScreen = ({ game }: { game: ReturnType<typeof useGame> }) => {
  const { state, namedSet, newGame } = game;
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="mt-16 text-center">
      <div className="text-6xl">🏆</div>
      <h2 className="mt-4 text-3xl font-bold">All {state.totalForSelection} named</h2>
      <p className="mt-2 opacity-70">Every team across your leagues has been called. Nice.</p>

      <div className="mt-8 flex flex-col gap-2">
        <button className="btn btn-primary" onClick={newGame}>
          New game
        </button>
        <button className="btn btn-ghost" onClick={() => setShowAll(true)}>
          See the full board
        </button>
      </div>

      {showAll && (
        <CheatSheet
          leagues={state.selectedLeagues}
          namedSet={namedSet}
          onClose={() => setShowAll(false)}
        />
      )}
    </div>
  );
};

export default GameOverScreen;
