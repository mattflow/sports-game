import type { GameState, Phase } from "../game/gameReducer";
import { initialState } from "../game/gameReducer";
import { ALL_LEAGUES } from "../data/leagues";

const KEY = "sports-game:v1";
const PHASES: Phase[] = ["setup", "playing", "gameover"];

/** Load persisted state, or null if absent/corrupt/incompatible. Feedback is never restored. */
export function loadState(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<GameState>;
    if (p.version !== 1) return null;
    if (!p.phase || !PHASES.includes(p.phase)) return null;
    if (!Array.isArray(p.selectedLeagues) || !Array.isArray(p.namedIds)) return null;
    const leagues = p.selectedLeagues.filter((l) => ALL_LEAGUES.includes(l));
    if (leagues.length === 0) return null;
    return {
      version: 1,
      phase: p.phase,
      selectedLeagues: leagues,
      namedIds: p.namedIds.filter((id) => typeof id === "string"),
      totalForSelection: typeof p.totalForSelection === "number" ? p.totalForSelection : 0,
      lastOutcome: { kind: "idle" },
    };
  } catch {
    return null;
  }
}

/** Persist the durable parts of game state (everything except transient feedback). */
export function saveState(state: GameState): void {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        version: 1,
        phase: state.phase,
        selectedLeagues: state.selectedLeagues,
        namedIds: state.namedIds,
        totalForSelection: state.totalForSelection,
      }),
    );
  } catch {
    // ignore (private mode / quota) — game still works in-memory
  }
}

export function loadOrInitial(): GameState {
  return loadState() ?? initialState();
}
