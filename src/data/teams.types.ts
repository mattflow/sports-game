export type League = "NBA" | "MLB" | "NFL" | "NHL";

/** The static, serializable shape authored in teams.ts (no resolved logo URL). */
export interface RawTeam {
  /** Stable unique key, e.g. "nba-lakers". League-prefixed so mascots can repeat across leagues. */
  id: string;
  league: League;
  /** City / region, e.g. "Los Angeles". */
  city: string;
  /** Mascot, e.g. "Lakers". */
  mascot: string;
  /** Display name, e.g. "Los Angeles Lakers". */
  fullName: string;
  /** Common abbreviation used for matching/display, e.g. "LAL". */
  abbreviation: string;
  /** ESPN logo slug used only by the logo download script + glob mapping, e.g. "lal". */
  espnAbbr: string;
  /** Extra accepted forms beyond the mechanically-derived ones (nicknames, legacy names). */
  aliases: string[];
}

/** A team with its resolved logo asset URL merged in (empty string if no asset bundled). */
export interface TeamData extends RawTeam {
  logo: string;
}
