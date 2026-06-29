// One-off helper: download team logos referenced by src/data/teams.ts into src/logos/img/.
// Run manually: `node scripts/download-logos.mjs`. Not part of the app bundle.
//
// NOTE: team names and logos are trademarks of their respective leagues/teams. Bundling
// official logos is only appropriate for personal, non-commercial, local use.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "src/logos/img");
const leagueDir = resolve(root, "src/logos/leagues");

// Parse team(...) rows out of the data file so we don't duplicate the dataset here.
const src = await readFile(resolve(root, "src/data/teams.ts"), "utf8");
const re = /team\(\s*"(\w+)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)",\s*"([^"]*)"/g;

const teams = [];
for (const m of src.matchAll(re)) {
  const [, league, , mascot, , espnAbbr] = m;
  const slug = mascot.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const id = `${league.toLowerCase()}-${slug}`;
  const url = `https://a.espncdn.com/i/teamlogos/${league.toLowerCase()}/500/${espnAbbr}.png`;
  teams.push({ id, url });
}

await mkdir(outDir, { recursive: true });
console.log(`Downloading ${teams.length} logos -> ${outDir}`);

const failures = [];
await Promise.all(
  teams.map(async ({ id, url }) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(resolve(outDir, `${id}.png`), buf);
    } catch (err) {
      failures.push(`${id} (${url}): ${err.message}`);
    }
  }),
);

console.log(`Done. ${teams.length - failures.length} ok, ${failures.length} failed.`);
if (failures.length) console.log("Failed:\n" + failures.join("\n"));

// League logos for the in-game "selected leagues" badges.
await mkdir(leagueDir, { recursive: true });
const leagues = ["nba", "nfl", "mlb", "nhl"];
const leagueFailures = [];
await Promise.all(
  leagues.map(async (lg) => {
    const url = `https://a.espncdn.com/i/teamlogos/leagues/500/${lg}.png`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await writeFile(resolve(leagueDir, `${lg}.png`), Buffer.from(await res.arrayBuffer()));
    } catch (err) {
      leagueFailures.push(`${lg} (${url}): ${err.message}`);
    }
  }),
);
console.log(`League logos: ${leagues.length - leagueFailures.length} ok, ${leagueFailures.length} failed.`);
if (leagueFailures.length) console.log("Failed:\n" + leagueFailures.join("\n"));
