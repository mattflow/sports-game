import type { League } from "../data/teams.types";

export interface LeagueRemaining {
  league: League;
  remaining: number;
}

interface Props {
  guessed: number;
  remainingByLeague: LeagueRemaining[];
}

const Score = ({ guessed, remainingByLeague }: Props) => (
  <div className="mx-2 mt-6 flex items-start justify-between gap-4">
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      <span>Remaining:</span>
      {remainingByLeague.map(({ league, remaining }) => (
        <span key={league}>
          {league}: <span className="font-semibold text-error">{remaining}</span>
        </span>
      ))}
    </div>
    <span>
      Guessed: <span className="font-semibold text-success">{guessed}</span>
    </span>
  </div>
);

export default Score;
