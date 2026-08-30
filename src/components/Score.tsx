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
  <div className="mt-6">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Remaining by league</span>
      <span className="text-sm">
        <span className="font-semibold text-success">{guessed}</span> guessed
      </span>
    </div>
    <div
      className="mt-2 grid gap-2"
      style={{ gridTemplateColumns: `repeat(${remainingByLeague.length}, minmax(0, 1fr))` }}
    >
      {remainingByLeague.map(({ league, remaining }) => (
        <div key={league} className="rounded-lg bg-base-200 px-2 py-2 text-center">
          <div className="text-xs font-medium opacity-60">{league}</div>
          <div className="text-lg font-semibold tabular-nums text-error">{remaining}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Score;
