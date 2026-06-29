import { useState } from "react";
import type { League } from "../data/teams.types";
import { ALL_LEAGUES, LEAGUES } from "../data/leagues";
import { teamsForLeagues } from "../data/teams";
import LeagueToggle from "./LeagueToggle";

interface Props {
  onStart: (leagues: League[]) => void;
  initialLeagues?: League[];
}

const SetupScreen = ({ onStart, initialLeagues = ALL_LEAGUES }: Props) => {
  const [selected, setSelected] = useState<League[]>([...initialLeagues]);

  const toggle = (league: League) =>
    setSelected((cur) =>
      cur.includes(league) ? cur.filter((l) => l !== league) : [...cur, league],
    );

  // keep canonical league order regardless of toggle order
  const ordered = ALL_LEAGUES.filter((l) => selected.includes(l));
  const total = teamsForLeagues(ordered).length;

  return (
    <div className="mt-10">
      <div className="grid gap-3">
        {LEAGUES.map((l) => (
          <LeagueToggle
            key={l.league}
            league={l.league}
            count={l.count}
            checked={selected.includes(l.league)}
            onToggle={toggle}
          />
        ))}
      </div>

      <button
        className="btn btn-primary mt-6 w-full"
        disabled={ordered.length === 0}
        onClick={() => onStart(ordered)}
      >
        {ordered.length === 0 ? "Select a league" : `Start · ${total} teams`}
      </button>
    </div>
  );
};

export default SetupScreen;
