import { useEffect, useMemo, useReducer, useState } from "react";
import type { League } from "../data/teams.types";
import { TEAMS_BY_ID, teamsForLeagues } from "../data/teams";
import { gameReducer } from "../game/gameReducer";
import type { MatchResult } from "../utils/matchTeam";
import { buildIndex, matchTeam } from "../utils/matchTeam";
import { loadOrInitial, saveState } from "../utils/storage";

function readTime(key: string): number | null {
  try {
    const value = localStorage.getItem(key);
    return value ? Number(value) : null;
  } catch {
    return null;
  }
}

function writeTime(key: string, value: number | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, String(value));
  } catch {
    // ignore (private mode / quota)
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, loadOrInitial);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Matching is scoped to the leagues in play, so out-of-scope teams read as unrecognized.
  const index = useMemo(
    () => buildIndex(teamsForLeagues(state.selectedLeagues)),
    [state.selectedLeagues],
  );

  const namedSet = useMemo(() => new Set(state.namedIds), [state.namedIds]);

  // Persisted timer: starts when a game begins, freezes when it's complete.
  // The win screen formats arbitrarily large gaps (days/months) gracefully.
  const [startedAt, setStartedAt] = useState<number | null>(() =>
    readTime("sports-game:startedAt"),
  );
  const [finishedAt, setFinishedAt] = useState<number | null>(() =>
    readTime("sports-game:finishedAt"),
  );
  useEffect(() => writeTime("sports-game:startedAt", startedAt), [startedAt]);
  useEffect(() => writeTime("sports-game:finishedAt", finishedAt), [finishedAt]);
  useEffect(() => {
    if (state.phase === "setup") {
      setStartedAt(null);
      setFinishedAt(null);
    } else if (state.phase === "playing") {
      setStartedAt((value) => value ?? Date.now());
      setFinishedAt(null);
    } else if (state.phase === "gameover") {
      setFinishedAt((value) => value ?? Date.now());
    }
  }, [state.phase]);
  const elapsedMs = startedAt !== null ? (finishedAt ?? Date.now()) - startedAt : 0;

  const startGame = (leagues: League[]) =>
    dispatch({ type: "START_GAME", leagues, total: teamsForLeagues(leagues).length });

  const submitGuess = (input: string): MatchResult => {
    const result = matchTeam(input, index);
    const teamName =
      result.kind === "exact" || result.kind === "fuzzy"
        ? TEAMS_BY_ID[result.teamId]?.fullName
        : undefined;
    dispatch({ type: "SUBMIT_RESULT", result, teamName });
    return result;
  };

  const clearFeedback = () => dispatch({ type: "CLEAR_FEEDBACK" });
  const reset = () => dispatch({ type: "RESET" });
  const newGame = () => dispatch({ type: "NEW_GAME" });

  return {
    state,
    namedSet,
    elapsedMs,
    startGame,
    submitGuess,
    clearFeedback,
    reset,
    newGame,
  };
}
