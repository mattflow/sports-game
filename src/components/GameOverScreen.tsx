import type { useGame } from "../hooks/useGame";
import { formatElapsed } from "../utils/formatElapsed";

const GameOverScreen = ({ game }: { game: ReturnType<typeof useGame> }) => {
  const { state, elapsedMs, newGame } = game;

  return (
    <div className="mt-8 text-center">
      <p className="text-lg">
        You named all {state.totalForSelection} in{" "}
        <span className="font-semibold tabular-nums">{formatElapsed(elapsedMs)}</span>
      </p>
      <button className="btn-ghost btn-sm btn mt-3" onClick={newGame}>
        New game
      </button>
    </div>
  );
};

export default GameOverScreen;
