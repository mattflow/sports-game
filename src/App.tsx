import Container from "./components/Container";
import GameOverScreen from "./components/GameOverScreen";
import GameScreen from "./components/GameScreen";
import Header from "./components/Header";
import SetupScreen from "./components/SetupScreen";
import { useGame } from "./hooks/useGame";

export default function App() {
  const game = useGame();
  const { phase } = game.state;

  return (
    <Container>
      <Header />
      {phase === "setup" && (
        <SetupScreen onStart={game.startGame} initialLeagues={game.state.selectedLeagues} />
      )}
      {phase === "playing" && <GameScreen game={game} />}
      {phase === "gameover" && <GameOverScreen game={game} />}
    </Container>
  );
}
