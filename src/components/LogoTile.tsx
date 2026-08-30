import type { TeamData } from "../data/teams.types";

interface Props {
  team: TeamData;
  named: boolean;
}

// Named -> full-colour logo. Not yet named -> muted colour (so players can spot
// which logos they're still missing without being told the name).
const LogoTile = ({ team, named }: Props) => (
  <div className="flex aspect-square items-center justify-center rounded-lg bg-base-200 p-2">
    {team.logo ? (
      <img
        src={team.logo}
        alt=""
        aria-hidden
        loading="lazy"
        className={`max-h-full max-w-full transition duration-300 ${
          named ? "" : "opacity-20"
        }`}
      />
    ) : (
      <div
        className={`flex h-full w-full items-center justify-center rounded text-xs font-bold ${
          named ? "bg-primary text-primary-content" : "bg-base-300 text-base-300"
        }`}
      >
        {team.abbreviation}
      </div>
    )}
  </div>
);

export default LogoTile;
