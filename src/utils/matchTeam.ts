import type { League, TeamData } from "../data/teams.types";
import { boundedLevenshtein } from "./levenshtein";
import { normalize, tokens } from "./normalize";

export type MatchResult =
  | { kind: "exact"; teamId: string }
  | { kind: "fuzzy"; teamId: string; distance: number }
  | { kind: "ambiguous"; teamIds: string[] }
  | { kind: "none" };

export interface TeamIndex {
  teams: TeamData[];
  /** normalized key -> set of team ids that key can refer to */
  byKey: Map<string, Set<string>>;
  /** unique (single-team) keys eligible for fuzzy matching (length >= 4) */
  fuzzyKeys: { key: string; teamId: string }[];
}

/** Common city abbreviations people type, mapped to the city used in the data. */
const CITY_ABBR: Record<string, string> = {
  la: "los angeles",
  ny: "new york",
  sf: "san francisco",
  sj: "san jose",
  nj: "new jersey",
  tb: "tampa bay",
  gb: "green bay",
  kc: "kansas city",
  okc: "oklahoma city",
  sd: "san diego",
  sa: "san antonio",
  no: "new orleans",
};

const LEAGUE_WORDS: Record<string, League> = {
  nba: "NBA",
  basketball: "NBA",
  nfl: "NFL",
  football: "NFL",
  mlb: "MLB",
  baseball: "MLB",
  nhl: "NHL",
  hockey: "NHL",
};

function addKey(map: Map<string, Set<string>>, key: string, id: string) {
  if (!key) return;
  let set = map.get(key);
  if (!set) {
    set = new Set();
    map.set(key, set);
  }
  set.add(id);
}

/** Build a lookup index from a (possibly filtered) set of teams. */
export function buildIndex(teams: TeamData[]): TeamIndex {
  const byKey = new Map<string, Set<string>>();
  for (const t of teams) {
    const keys = [
      t.fullName,
      t.mascot,
      t.city,
      t.abbreviation,
      `${t.city} ${t.mascot}`,
      ...t.aliases,
    ];
    for (const k of keys) addKey(byKey, normalize(k), t.id);
  }

  const fuzzyKeys: { key: string; teamId: string }[] = [];
  for (const [key, ids] of byKey) {
    if (ids.size === 1 && key.length >= 4) {
      fuzzyKeys.push({ key, teamId: [...ids][0] });
    }
  }

  return { teams, byKey, fuzzyKeys };
}

/** Does the contiguous phrase `phrase` appear within `seq`? */
function containsPhrase(seq: string[], phrase: string[]): boolean {
  if (phrase.length === 0 || phrase.length > seq.length) return false;
  for (let i = 0; i <= seq.length - phrase.length; i++) {
    let ok = true;
    for (let j = 0; j < phrase.length; j++) {
      if (seq[i + j] !== phrase[j]) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

/** Is a city/abbreviation token for `team` present among the query tokens? */
function cityOrAbbrPresent(qTokens: string[], team: TeamData): boolean {
  const cityToks = tokens(team.city);
  if (cityToks.some((c) => qTokens.includes(c))) return true;
  if (qTokens.includes(normalize(team.abbreviation))) return true;
  const cityNorm = normalize(team.city);
  for (const t of qTokens) {
    if (CITY_ABBR[t] === cityNorm) return true;
  }
  return false;
}

/**
 * Token-aware resolution for inputs like "rangers nhl", "ny rangers", "texas rangers"
 * where a (possibly shared) mascot is pinned by a league/city token.
 */
function resolveByTokens(qTokens: string[], index: TeamIndex): MatchResult {
  let leagueHint: League | undefined;
  for (const t of qTokens) {
    if (LEAGUE_WORDS[t]) leagueHint = LEAGUE_WORDS[t];
  }

  let candidates = index.teams.filter((t) =>
    containsPhrase(qTokens, tokens(t.mascot)),
  );
  if (candidates.length === 0) return { kind: "none" };

  if (leagueHint) {
    const byLeague = candidates.filter((t) => t.league === leagueHint);
    if (byLeague.length > 0) candidates = byLeague;
  }

  if (candidates.length > 1) {
    const byCity = candidates.filter((t) => cityOrAbbrPresent(qTokens, t));
    if (byCity.length > 0) candidates = byCity;
  }

  if (candidates.length === 1) return { kind: "exact", teamId: candidates[0].id };
  if (candidates.length > 1) {
    return { kind: "ambiguous", teamIds: candidates.map((t) => t.id) };
  }
  return { kind: "none" };
}

function fuzzyMatch(q: string, index: TeamIndex): MatchResult {
  // best edit distance achieved per team within that key's adaptive budget
  const bestPerTeam = new Map<string, number>();
  for (const { key, teamId } of index.fuzzyKeys) {
    const max = key.length <= 6 ? 1 : 2;
    const d = boundedLevenshtein(q, key, max);
    if (d <= max) {
      const prev = bestPerTeam.get(teamId);
      if (prev === undefined || d < prev) bestPerTeam.set(teamId, d);
    }
  }
  if (bestPerTeam.size === 0) return { kind: "none" };

  const ranked = [...bestPerTeam.entries()].sort((a, b) => a[1] - b[1]);
  const best = ranked[0];
  const tiedTeams = ranked.filter(([, d]) => d === best[1]).map(([id]) => id);
  if (tiedTeams.length > 1) return { kind: "ambiguous", teamIds: tiedTeams };
  return { kind: "fuzzy", teamId: best[0], distance: best[1] };
}

/** Resolve free-text input to a team, cheap checks first. */
export function matchTeam(input: string, index: TeamIndex): MatchResult {
  const q = normalize(input);
  if (!q) return { kind: "none" };

  // 1. exact normalized key
  const exact = index.byKey.get(q);
  if (exact) {
    if (exact.size === 1) return { kind: "exact", teamId: [...exact][0] };
    return { kind: "ambiguous", teamIds: [...exact] };
  }

  // 2. token-aware (mascot pinned by league/city token)
  const byTokens = resolveByTokens(tokens(q), index);
  if (byTokens.kind !== "none") return byTokens;

  // 3. bounded fuzzy fallback
  return fuzzyMatch(q, index);
}
