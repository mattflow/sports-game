import { describe, expect, it } from "vitest";
import { TEAMS } from "../data/teams";
import { buildIndex, matchTeam } from "./matchTeam";

const index = buildIndex(TEAMS);
const match = (input: string) => matchTeam(input, index);

describe("matchTeam — exact / alias / abbreviation", () => {
  it("resolves mascot, city+mascot, full name, and abbreviation to the same team", () => {
    for (const input of ["Lakers", "LA Lakers", "Los Angeles Lakers", "LAL", "lakers!"]) {
      const r = match(input);
      expect(r).toMatchObject({ teamId: "nba-lakers" });
    }
  });

  it("handles digit-bearing mascots and nicknames", () => {
    expect(match("49ers")).toMatchObject({ teamId: "nfl-49ers" });
    expect(match("Niners")).toMatchObject({ teamId: "nfl-49ers" });
    expect(match("Sixers")).toMatchObject({ teamId: "nba-76ers" });
    expect(match("Habs")).toMatchObject({ teamId: "nhl-canadiens" });
  });

  it("strips accents", () => {
    expect(match("Montréal Canadiens")).toMatchObject({ teamId: "nhl-canadiens" });
  });
});

describe("matchTeam — fuzzy typo tolerance", () => {
  it("accepts small typos", () => {
    expect(match("Lakeres")).toMatchObject({ kind: "fuzzy", teamId: "nba-lakers" });
    expect(match("Dallas Cowbyos")).toMatchObject({ teamId: "nfl-cowboys" });
    expect(match("Cardinls")).toBeTruthy(); // resolves to something cardinal-ish
  });

  it("does not fuzzy-match nonsense", () => {
    expect(match("asdf").kind).toBe("none");
    expect(match("zzzzzzz").kind).toBe("none");
    expect(match("").kind).toBe("none");
    expect(match("   ").kind).toBe("none");
  });

  it("does not fuzzy-match short abbreviations to other abbreviations", () => {
    // BAL (Orioles/Ravens) must never fuzzy-resolve to LAL (Lakers)
    const r = match("bal");
    if (r.kind === "fuzzy" || r.kind === "exact") {
      expect(r.teamId).not.toBe("nba-lakers");
    }
  });
});

describe("matchTeam — ambiguity", () => {
  const ambiguous = (input: string) => {
    const r = match(input);
    expect(r.kind).toBe("ambiguous");
    return r.kind === "ambiguous" ? r.teamIds : [];
  };

  it("treats shared mascots as ambiguous", () => {
    expect(ambiguous("Rangers").sort()).toEqual(["mlb-rangers", "nhl-rangers"]);
    expect(ambiguous("Cardinals").sort()).toEqual(["mlb-cardinals", "nfl-cardinals"]);
    expect(ambiguous("Jets").sort()).toEqual(["nfl-jets", "nhl-jets"]);
    expect(ambiguous("Panthers").sort()).toEqual(["nfl-panthers", "nhl-panthers"]);
    expect(ambiguous("Kings").sort()).toEqual(["nba-kings", "nhl-kings"]);
    expect(ambiguous("Giants").sort()).toEqual(["mlb-giants", "nfl-giants"]);
  });

  it("treats multi-team cities as ambiguous", () => {
    expect(match("New York").kind).toBe("ambiguous");
    expect(match("Chicago").kind).toBe("ambiguous");
  });

  it("resolves shared mascots when a city or league token is added", () => {
    expect(match("Texas Rangers")).toMatchObject({ teamId: "mlb-rangers" });
    expect(match("NY Rangers")).toMatchObject({ teamId: "nhl-rangers" });
    expect(match("Rangers NHL")).toMatchObject({ teamId: "nhl-rangers" });
    expect(match("Winnipeg Jets")).toMatchObject({ teamId: "nhl-jets" });
    expect(match("Florida Panthers")).toMatchObject({ teamId: "nhl-panthers" });
    expect(match("LA Kings")).toMatchObject({ teamId: "nhl-kings" });
  });
});

describe("scoping the index to selected leagues", () => {
  it("does not recognize out-of-scope teams", () => {
    const nbaOnly = buildIndex(TEAMS.filter((t) => t.league === "NBA"));
    expect(matchTeam("Yankees", nbaOnly).kind).toBe("none");
    // and a shared mascot becomes unambiguous within a single league
    expect(matchTeam("Kings", nbaOnly)).toMatchObject({ teamId: "nba-kings" });
  });
});
