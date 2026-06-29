import type { League } from "../data/teams.types";
import { teamsForLeagues } from "../data/teams";
import LogoTile from "./LogoTile";

interface Props {
  leagues: League[];
  namedSet: Set<string>;
  onClose: () => void;
}

const CheatSheet = ({ leagues, namedSet, onClose }: Props) => {
  const teams = teamsForLeagues(leagues);
  return (
    <div className="modal modal-open modal-bottom sm:modal-middle">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-end">
          <button className="btn btn-circle btn-sm" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {teams.map((t) => (
            <LogoTile key={t.id} team={t} named={namedSet.has(t.id)} />
          ))}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </div>
  );
};

export default CheatSheet;
