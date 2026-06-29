import { describe, expect, it } from "vitest";
import { buildIndex, matchTeam } from "../utils/matchTeam";
import { LEAGUE_META, LEAGUES } from "./leagues";
import { TEAMS } from "./teams";

describe("team dataset integrity", () => {
  it("has 124 teams with correct per-league counts", () => {
    expect(TEAMS).toHaveLength(124);
    for (const meta of LEAGUES) {
      const n = TEAMS.filter((t) => t.league === meta.league).length;
      expect(n, meta.league).toBe(meta.count);
    }
  });

  it("has unique ids and valid required fields", () => {
    const ids = new Set<string>();
    for (const t of TEAMS) {
      expect(ids.has(t.id), `duplicate id ${t.id}`).toBe(false);
      ids.add(t.id);
      expect(t.city.length).toBeGreaterThan(0);
      expect(t.mascot.length).toBeGreaterThan(0);
      expect(t.abbreviation.length).toBeGreaterThan(0);
      expect(t.espnAbbr.length).toBeGreaterThan(0);
      expect(LEAGUE_META[t.league]).toBeTruthy();
    }
  });

  it("round-trips every full name back to its own team", () => {
    const index = buildIndex(TEAMS);
    for (const t of TEAMS) {
      const r = matchTeam(t.fullName, index);
      expect(r, t.fullName).toMatchObject({ teamId: t.id });
    }
  });
});
