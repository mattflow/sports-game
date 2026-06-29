import type { League } from "../data/teams.types";

// League logos for the in-game "selected leagues" badges.
const modules = import.meta.glob("./leagues/*.{png,svg,webp}", {
  eager: true,
  import: "default",
});

const byFile: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  const file = path.split("/").pop() ?? "";
  const key = file.replace(/\.(png|svg|webp)$/i, "");
  byFile[key] = url as string;
}

export const LEAGUE_LOGOS: Record<League, string> = {
  NBA: byFile.nba ?? "",
  NFL: byFile.nfl ?? "",
  MLB: byFile.mlb ?? "",
  NHL: byFile.nhl ?? "",
};
