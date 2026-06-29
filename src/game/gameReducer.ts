import type { League } from "../data/teams.types";
import { ALL_LEAGUES } from "../data/leagues";
import type { MatchResult } from "../utils/matchTeam";

export type Phase = "setup" | "playing" | "gameover";

/** Result of the most recent guess, used to drive transient feedback. Never persisted. */
export type Outcome =
  | { kind: "idle" }
  | { kind: "correct"; teamName: string }
  | { kind: "drink" }
  | { kind: "ambiguous"; teamIds: string[] }
  | { kind: "none" };

export interface GameState {
  version: 1;
  phase: Phase;
  selectedLeagues: League[];
  /** The hidden "already named" set — never rendered as a list on the game screen. */
  namedIds: string[];
  totalForSelection: number;
  lastOutcome: Outcome;
}

export type GameAction =
  | { type: "START_GAME"; leagues: League[]; total: number }
  | { type: "SUBMIT_RESULT"; result: MatchResult; teamName?: string }
  | { type: "CLEAR_FEEDBACK" }
  | { type: "RESET" }
  | { type: "NEW_GAME" };

export function initialState(): GameState {
  return {
    version: 1,
    phase: "setup",
    selectedLeagues: [...ALL_LEAGUES],
    namedIds: [],
    totalForSelection: 0,
    lastOutcome: { kind: "idle" },
  };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        version: 1,
        phase: "playing",
        selectedLeagues: action.leagues,
        namedIds: [],
        totalForSelection: action.total,
        lastOutcome: { kind: "idle" },
      };

    case "SUBMIT_RESULT": {
      const r = action.result;
      if (r.kind === "exact" || r.kind === "fuzzy") {
        if (state.namedIds.includes(r.teamId)) {
          return { ...state, lastOutcome: { kind: "drink" } };
        }
        const namedIds = [...state.namedIds, r.teamId];
        const done = namedIds.length >= state.totalForSelection;
        return {
          ...state,
          namedIds,
          phase: done ? "gameover" : "playing",
          lastOutcome: { kind: "correct", teamName: action.teamName ?? "" },
        };
      }
      if (r.kind === "ambiguous") {
        return { ...state, lastOutcome: { kind: "ambiguous", teamIds: r.teamIds } };
      }
      return { ...state, lastOutcome: { kind: "none" } };
    }

    case "CLEAR_FEEDBACK":
      return state.lastOutcome.kind === "idle"
        ? state
        : { ...state, lastOutcome: { kind: "idle" } };

    case "RESET":
      return { ...state, namedIds: [], phase: "playing", lastOutcome: { kind: "idle" } };

    case "NEW_GAME":
      return { ...state, phase: "setup", namedIds: [], lastOutcome: { kind: "idle" } };

    default:
      return state;
  }
}
