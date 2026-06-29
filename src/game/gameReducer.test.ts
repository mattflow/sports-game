import { describe, expect, it } from "vitest";
import type { GameState } from "./gameReducer";
import { gameReducer, initialState } from "./gameReducer";

function playing(total: number, namedIds: string[] = []): GameState {
  return {
    version: 1,
    phase: "playing",
    selectedLeagues: ["NBA"],
    namedIds,
    totalForSelection: total,
    lastOutcome: { kind: "idle" },
  };
}

describe("gameReducer", () => {
  it("starts a game with the given leagues and total", () => {
    const s = gameReducer(initialState(), { type: "START_GAME", leagues: ["NBA"], total: 30 });
    expect(s.phase).toBe("playing");
    expect(s.totalForSelection).toBe(30);
    expect(s.namedIds).toEqual([]);
  });

  it("marks a new team correct and a repeat as drink", () => {
    let s = playing(30);
    s = gameReducer(s, { type: "SUBMIT_RESULT", result: { kind: "exact", teamId: "nba-lakers" } });
    expect(s.lastOutcome.kind).toBe("correct");
    expect(s.namedIds).toEqual(["nba-lakers"]);

    s = gameReducer(s, { type: "SUBMIT_RESULT", result: { kind: "exact", teamId: "nba-lakers" } });
    expect(s.lastOutcome.kind).toBe("drink");
    expect(s.namedIds).toEqual(["nba-lakers"]); // unchanged
  });

  it("transitions to gameover when the final team is named", () => {
    let s = playing(2, ["nba-lakers"]);
    s = gameReducer(s, { type: "SUBMIT_RESULT", result: { kind: "fuzzy", teamId: "nba-celtics", distance: 1 } });
    expect(s.phase).toBe("gameover");
    expect(s.namedIds).toHaveLength(2);
  });

  it("does not name anything on ambiguous or none", () => {
    let s = playing(30, ["nba-lakers"]);
    s = gameReducer(s, { type: "SUBMIT_RESULT", result: { kind: "ambiguous", teamIds: ["a", "b"] } });
    expect(s.lastOutcome).toMatchObject({ kind: "ambiguous" });
    expect(s.namedIds).toEqual(["nba-lakers"]);

    s = gameReducer(s, { type: "SUBMIT_RESULT", result: { kind: "none" } });
    expect(s.lastOutcome.kind).toBe("none");
    expect(s.namedIds).toEqual(["nba-lakers"]);
  });

  it("resets progress but stays in play; new game returns to setup", () => {
    expect(gameReducer(playing(30, ["nba-lakers"]), { type: "RESET" })).toMatchObject({
      phase: "playing",
      namedIds: [],
    });
    expect(gameReducer(playing(30, ["nba-lakers"]), { type: "NEW_GAME" })).toMatchObject({
      phase: "setup",
      namedIds: [],
    });
  });
});
