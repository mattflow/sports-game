import type { League } from "../data/teams.types";

// Logos are served from ESPN's public CDN at runtime rather than bundled into the
// repo, so we don't check trademarked images into source control.
const BASE = "https://a.espncdn.com/i/teamlogos";

/** Team logo URL, e.g. nba + "lal" -> .../nba/500/lal.png */
export function teamLogoUrl(league: League, espnAbbr: string): string {
  return `${BASE}/${league.toLowerCase()}/500/${espnAbbr}.png`;
}

/** League logo URL, e.g. NBA -> .../leagues/500/nba.png */
export function leagueLogoUrl(league: League): string {
  return `${BASE}/leagues/500/${league.toLowerCase()}.png`;
}
