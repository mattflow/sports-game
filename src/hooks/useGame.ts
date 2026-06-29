import { useEffect, useMemo, useReducer } from "react";
import type { League } from "../data/teams.types";
import { TEAMS_BY_ID, teamsForLeagues } from "../data/teams";
import { gameReducer } from "../game/gameReducer";
import type { MatchResult } from "../utils/matchTeam";
import { buildIndex, matchTeam } from "../utils/matchTeam";
import { loadOrInitial, saveState } from "../utils/storage";

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

  return { state, namedSet, startGame, submitGuess, clearFeedback, reset, newGame };
}
