import type { League } from "../data/teams.types";

interface Props {
  league: League;
  count: number;
  checked: boolean;
  onToggle: (league: League) => void;
}

const LeagueToggle = ({ league, count, checked, onToggle }: Props) => (
  <label
    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition ${
      checked ? "border-primary bg-primary/10" : "border-base-300"
    }`}
  >
    <div>
      <div className="text-lg font-semibold">{league}</div>
      <div className="text-sm opacity-60">{count} teams</div>
    </div>
    <input
      type="checkbox"
      className="checkbox checkbox-primary"
      checked={checked}
      onChange={() => onToggle(league)}
    />
  </label>
);

export default LeagueToggle;
