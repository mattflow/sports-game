import type { League } from "./teams.types";

export interface LeagueMeta {
  league: League;
  /** Full league name for display. */
  fullName: string;
  /** Expected team count (used by the data-integrity test). */
  count: number;
  /** Tailwind/DaisyUI text-color accent class for grouping headers. */
  accent: string;
}

/** Display order + metadata for each league. */
export const LEAGUES: LeagueMeta[] = [
  { league: "NBA", fullName: "National Basketball Association", count: 30, accent: "text-orange-500" },
  { league: "NFL", fullName: "National Football League", count: 32, accent: "text-emerald-600" },
  { league: "MLB", fullName: "Major League Baseball", count: 30, accent: "text-blue-600" },
  { league: "NHL", fullName: "National Hockey League", count: 32, accent: "text-sky-500" },
];

export const ALL_LEAGUES: League[] = LEAGUES.map((l) => l.league);

export const LEAGUE_META: Record<League, LeagueMeta> = LEAGUES.reduce(
  (acc, l) => {
    acc[l.league] = l;
    return acc;
  },
  {} as Record<League, LeagueMeta>,
);
