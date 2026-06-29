import type { League } from "../data/teams.types";
import { ALL_LEAGUES } from "../data/leagues";
import { LEAGUE_LOGOS } from "../logos/leagues";

// Shows which leagues are in play this game as small logo badges.
const LeagueBadges = ({ leagues }: { leagues: League[] }) => {
  const ordered = ALL_LEAGUES.filter((l) => leagues.includes(l));
  return (
    <div className="flex items-center gap-1.5">
      {ordered.map((league) => (
        <div
          key={league}
          title={league}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-base-200 p-1"
        >
          {LEAGUE_LOGOS[league] ? (
            <img src={LEAGUE_LOGOS[league]} alt={league} className="max-h-full max-w-full" />
          ) : (
            <span className="text-[10px] font-bold">{league}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default LeagueBadges;
