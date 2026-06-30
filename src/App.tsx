import { useEffect, useRef, useState } from "react";
import Container from "./components/Container";
import DebugMenu from "./components/DebugMenu";
import GameScreen from "./components/GameScreen";
import Header from "./components/Header";
import SetupScreen from "./components/SetupScreen";
import { teamsForLeagues } from "./data/teams";
import { useGame } from "./hooks/useGame";

export default function App() {
  const game = useGame();
  const { phase } = game.state;

  // Secret debug menu: Ctrl/Cmd+Shift+D toggles it, or load with ?debug.
  const [debug, setDebug] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).has("debug");
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key.toLowerCase() === "d"
      ) {
        event.preventDefault();
        setDebug((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mobile-friendly secret trigger: tap the title 5 times quickly.
  const tapCount = useRef(0);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onTitleTap = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapCount.current += 1;
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      setDebug((value) => !value);
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 1500);
  };

  const unnamed = teamsForLeagues(game.state.selectedLeagues).filter(
    (team) => !game.namedSet.has(team.id),
  );
  const allButOne = unnamed[unnamed.length - 1] ?? null;

  return (
    <Container>
      <Header onTitleTap={onTitleTap} />
      {phase === "setup" && (
        <SetupScreen onStart={game.startGame} initialLeagues={game.state.selectedLeagues} />
      )}
      {(phase === "playing" || phase === "gameover") && <GameScreen game={game} />}

      {debug && (phase === "playing" || phase === "gameover") && (
        <DebugMenu
          onWin={() => unnamed.forEach((team) => game.submitGuess(team.fullName))}
          allButOneTeam={allButOne?.fullName ?? null}
          onAllButOne={() =>
            unnamed
              .filter((team) => team.id !== allButOne?.id)
              .forEach((team) => game.submitGuess(team.fullName))
          }
          onAddTen={() => {
            const pool = [...unnamed];
            for (let i = 0; i < 10 && pool.length > 0; i++) {
              const index = Math.floor(Math.random() * pool.length);
              game.submitGuess(pool.splice(index, 1)[0].fullName);
            }
          }}
          onClear={game.reset}
          onClose={() => setDebug(false)}
        />
      )}
    </Container>
  );
}
