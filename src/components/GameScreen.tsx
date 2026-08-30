import { useEffect, useRef, useState } from "react";
import { ALL_LEAGUES } from "../data/leagues";
import { teamsForLeagues } from "../data/teams";
import type { useGame } from "../hooks/useGame";
import { formatElapsed } from "../utils/formatElapsed";
import CheatSheet from "./CheatSheet";
import GuessInput from "./GuessInput";
import LeagueBadges from "./LeagueBadges";
import Score from "./Score";

// Delay after the player stops typing before we check the guess, and how long a
// correct team name lingers in green before disappearing.
const CHECK_MS = 800;
const NAME_VISIBLE_MS = 1200;

const GameScreen = ({ game }: { game: ReturnType<typeof useGame> }) => {
  const { state, namedSet, elapsedMs, submitGuess, clearFeedback, newGame } = game;
  const [value, setValue] = useState("");
  const [cheatOpen, setCheatOpen] = useState(false);
  const [confirmNew, setConfirmNew] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const remainingByLeague = ALL_LEAGUES.filter((league) =>
    state.selectedLeagues.includes(league),
  ).map((league) => ({
    league,
    remaining: teamsForLeagues([league]).filter((team) => !namedSet.has(team.id)).length,
  }));

  // Debounced check: once typing settles, resolve the guess. A brand-new correct
  // guess clears the input so the next player starts fresh.
  useEffect(() => {
    if (!value.trim()) return;
    const checkId = setTimeout(() => {
      const result = submitGuess(value);
      const isNewCorrect =
        (result.kind === "exact" || result.kind === "fuzzy") &&
        !namedSet.has(result.teamId);
      if (isNewCorrect) setValue("");
    }, CHECK_MS);
    return () => clearTimeout(checkId);
  }, [value, submitGuess, namedSet]);

  // The green team name fades on its own after a correct guess.
  useEffect(() => {
    if (state.lastOutcome.kind !== "correct") return;
    const t = setTimeout(clearFeedback, NAME_VISIBLE_MS);
    return () => clearTimeout(t);
  }, [state.lastOutcome, clearFeedback]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (state.lastOutcome.kind !== "idle") clearFeedback(); // hide stale feedback while typing
  };

  return (
    <div>
      <div className="mt-8 flex items-center justify-between">
        <LeagueBadges leagues={state.selectedLeagues} />
        <div className="space-x-2">
          <button className="btn btn-sm" onClick={() => setCheatOpen(true)}>
            Cheat
          </button>
          <button className="btn btn-sm" onClick={() => setConfirmNew(true)}>
            New game
          </button>
        </div>
      </div>

      <Score
        guessed={state.namedIds.length}
        remainingByLeague={remainingByLeague}
      />

      {state.phase === "gameover" ? (
        <div className="mt-8 text-center">
          <p className="text-lg">
            You named all {state.totalForSelection} in{" "}
            <span className="font-semibold tabular-nums">{formatElapsed(elapsedMs)}</span>
          </p>
        </div>
      ) : (
        <GuessInput
          value={value}
          onChange={onChange}
          outcome={state.lastOutcome}
          inputRef={inputRef}
        />
      )}

      {cheatOpen && (
        <CheatSheet
          leagues={state.selectedLeagues}
          namedSet={namedSet}
          onClose={() => {
            setCheatOpen(false);
            inputRef.current?.focus();
          }}
        />
      )}

      {confirmNew && (
        <div className="modal modal-open modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="text-lg font-bold">New game?</h3>
            <p className="pt-2 opacity-70">
              This clears your progress and lets you pick leagues again.
            </p>
            <div className="modal-action">
              <button className="btn btn-sm" onClick={() => setConfirmNew(false)}>
                Cancel
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => {
                  newGame();
                  setConfirmNew(false);
                }}
              >
                New game
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setConfirmNew(false)} />
        </div>
      )}
    </div>
  );
};

export default GameScreen;
