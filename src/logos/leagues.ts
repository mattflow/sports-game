import type { League } from "../data/teams.types";
import { ALL_LEAGUES } from "../data/leagues";
import { leagueLogoUrl } from "./cdn";

// League logos (CDN) for the in-game "selected leagues" badges.
export const LEAGUE_LOGOS: Record<League, string> = ALL_LEAGUES.reduce(
  (acc, league) => {
    acc[league] = leagueLogoUrl(league);
    return acc;
  },
  {} as Record<League, string>,
);
