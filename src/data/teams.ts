import type { League, RawTeam, TeamData } from "./teams.types";
import { teamLogoUrl } from "../logos/cdn";

// One row per team. `aliases` holds ONLY forms the matcher can't mechanically
// derive (it already accepts mascot, city, fullName, "city mascot", abbreviation).
const RAW_TEAMS: RawTeam[] = [
  // ---------------------------------------------------------------- NBA (30)
  team("NBA", "Atlanta", "Hawks", "ATL", "atl", []),
  team("NBA", "Boston", "Celtics", "BOS", "bos", ["Cs"]),
  team("NBA", "Brooklyn", "Nets", "BKN", "bkn", []),
  team("NBA", "Charlotte", "Hornets", "CHA", "cha", []),
  team("NBA", "Chicago", "Bulls", "CHI", "chi", []),
  team("NBA", "Cleveland", "Cavaliers", "CLE", "cle", ["Cavs"]),
  team("NBA", "Dallas", "Mavericks", "DAL", "dal", ["Mavs"]),
  team("NBA", "Denver", "Nuggets", "DEN", "den", []),
  team("NBA", "Detroit", "Pistons", "DET", "det", []),
  team("NBA", "Golden State", "Warriors", "GSW", "gs", ["Dubs"]),
  team("NBA", "Houston", "Rockets", "HOU", "hou", []),
  team("NBA", "Indiana", "Pacers", "IND", "ind", []),
  team("NBA", "Los Angeles", "Clippers", "LAC", "lac", ["LA Clippers", "Clips"]),
  team("NBA", "Los Angeles", "Lakers", "LAL", "lal", ["LA Lakers"]),
  team("NBA", "Memphis", "Grizzlies", "MEM", "mem", ["Grizz"]),
  team("NBA", "Miami", "Heat", "MIA", "mia", []),
  team("NBA", "Milwaukee", "Bucks", "MIL", "mil", []),
  team("NBA", "Minnesota", "Timberwolves", "MIN", "min", ["Wolves", "T-Wolves", "Twolves"]),
  team("NBA", "New Orleans", "Pelicans", "NOP", "no", ["Pels"]),
  team("NBA", "New York", "Knicks", "NYK", "ny", ["NY Knicks"]),
  team("NBA", "Oklahoma City", "Thunder", "OKC", "okc", ["OKC Thunder"]),
  team("NBA", "Orlando", "Magic", "ORL", "orl", []),
  team("NBA", "Philadelphia", "76ers", "PHI", "phi", ["Sixers", "Philadelphia Sixers"]),
  team("NBA", "Phoenix", "Suns", "PHX", "phx", []),
  team("NBA", "Portland", "Trail Blazers", "POR", "por", ["Blazers", "Portland Blazers"]),
  team("NBA", "Sacramento", "Kings", "SAC", "sac", ["Sac Kings"]),
  team("NBA", "San Antonio", "Spurs", "SAS", "sa", []),
  team("NBA", "Toronto", "Raptors", "TOR", "tor", ["Raps"]),
  team("NBA", "Utah", "Jazz", "UTA", "utah", []),
  team("NBA", "Washington", "Wizards", "WAS", "wsh", ["Wiz"]),

  // ---------------------------------------------------------------- NFL (32)
  team("NFL", "Arizona", "Cardinals", "ARI", "ari", ["AZ Cardinals", "Arizona Cards"]),
  team("NFL", "Atlanta", "Falcons", "ATL", "atl", []),
  team("NFL", "Baltimore", "Ravens", "BAL", "bal", []),
  team("NFL", "Buffalo", "Bills", "BUF", "buf", []),
  team("NFL", "Carolina", "Panthers", "CAR", "car", []),
  team("NFL", "Chicago", "Bears", "CHI", "chi", ["Da Bears"]),
  team("NFL", "Cincinnati", "Bengals", "CIN", "cin", []),
  team("NFL", "Cleveland", "Browns", "CLE", "cle", []),
  team("NFL", "Dallas", "Cowboys", "DAL", "dal", ["Boys"]),
  team("NFL", "Denver", "Broncos", "DEN", "den", []),
  team("NFL", "Detroit", "Lions", "DET", "det", []),
  team("NFL", "Green Bay", "Packers", "GB", "gb", ["Pack"]),
  team("NFL", "Houston", "Texans", "HOU", "hou", []),
  team("NFL", "Indianapolis", "Colts", "IND", "ind", []),
  team("NFL", "Jacksonville", "Jaguars", "JAX", "jax", ["Jags"]),
  team("NFL", "Kansas City", "Chiefs", "KC", "kc", []),
  team("NFL", "Las Vegas", "Raiders", "LV", "lv", ["Oakland Raiders", "Vegas Raiders"]),
  team("NFL", "Los Angeles", "Chargers", "LAC", "lac", ["LA Chargers", "Bolts", "San Diego Chargers"]),
  team("NFL", "Los Angeles", "Rams", "LAR", "lar", ["LA Rams"]),
  team("NFL", "Miami", "Dolphins", "MIA", "mia", ["Fins"]),
  team("NFL", "Minnesota", "Vikings", "MIN", "min", ["Vikes"]),
  team("NFL", "New England", "Patriots", "NE", "ne", ["Pats", "NE Patriots"]),
  team("NFL", "New Orleans", "Saints", "NO", "no", []),
  team("NFL", "New York", "Giants", "NYG", "nyg", ["NY Giants", "G-Men"]),
  team("NFL", "New York", "Jets", "NYJ", "nyj", ["NY Jets", "Gang Green"]),
  team("NFL", "Philadelphia", "Eagles", "PHI", "phi", ["Iggles"]),
  team("NFL", "Pittsburgh", "Steelers", "PIT", "pit", []),
  team("NFL", "San Francisco", "49ers", "SF", "sf", ["Niners", "9ers"]),
  team("NFL", "Seattle", "Seahawks", "SEA", "sea", []),
  team("NFL", "Tampa Bay", "Buccaneers", "TB", "tb", ["Bucs"]),
  team("NFL", "Tennessee", "Titans", "TEN", "ten", []),
  team("NFL", "Washington", "Commanders", "WAS", "wsh", ["Washington Commanders", "Commies"]),

  // ---------------------------------------------------------------- MLB (30)
  team("MLB", "Arizona", "Diamondbacks", "ARI", "ari", ["Dbacks", "D-backs", "Snakes"]),
  team("MLB", "Atlanta", "Braves", "ATL", "atl", []),
  team("MLB", "Baltimore", "Orioles", "BAL", "bal", ["Os"]),
  team("MLB", "Boston", "Red Sox", "BOS", "bos", ["BoSox"]),
  team("MLB", "Chicago", "Cubs", "CHC", "chc", ["Cubbies"]),
  team("MLB", "Chicago", "White Sox", "CWS", "chw", ["ChiSox"]),
  team("MLB", "Cincinnati", "Reds", "CIN", "cin", []),
  team("MLB", "Cleveland", "Guardians", "CLE", "cle", []),
  team("MLB", "Colorado", "Rockies", "COL", "col", ["Rox"]),
  team("MLB", "Detroit", "Tigers", "DET", "det", []),
  team("MLB", "Houston", "Astros", "HOU", "hou", ["Stros"]),
  team("MLB", "Kansas City", "Royals", "KC", "kc", []),
  team("MLB", "Los Angeles", "Angels", "LAA", "laa", ["LA Angels", "Anaheim Angels", "Halos"]),
  team("MLB", "Los Angeles", "Dodgers", "LAD", "lad", ["LA Dodgers"]),
  team("MLB", "Miami", "Marlins", "MIA", "mia", []),
  team("MLB", "Milwaukee", "Brewers", "MIL", "mil", ["Crew"]),
  team("MLB", "Minnesota", "Twins", "MIN", "min", []),
  team("MLB", "New York", "Yankees", "NYY", "nyy", ["NY Yankees", "Yanks"]),
  team("MLB", "New York", "Mets", "NYM", "nym", ["NY Mets"]),
  team("MLB", "Oakland", "Athletics", "OAK", "oak", ["As", "Oakland As", "Sacramento Athletics"]),
  team("MLB", "Philadelphia", "Phillies", "PHI", "phi", ["Phils"]),
  team("MLB", "Pittsburgh", "Pirates", "PIT", "pit", ["Buccos"]),
  team("MLB", "San Diego", "Padres", "SD", "sd", ["Pads", "Friars"]),
  team("MLB", "San Francisco", "Giants", "SF", "sf", ["SF Giants"]),
  team("MLB", "Seattle", "Mariners", "SEA", "sea", []),
  team("MLB", "St. Louis", "Cardinals", "STL", "stl", ["Cards", "Redbirds"]),
  team("MLB", "Tampa Bay", "Rays", "TB", "tb", []),
  team("MLB", "Texas", "Rangers", "TEX", "tex", []),
  team("MLB", "Toronto", "Blue Jays", "TOR", "tor", ["Jays"]),
  team("MLB", "Washington", "Nationals", "WSH", "wsh", ["Nats"]),

  // ---------------------------------------------------------------- NHL (32)
  team("NHL", "Anaheim", "Ducks", "ANA", "ana", ["Mighty Ducks"]),
  team("NHL", "Boston", "Bruins", "BOS", "bos", ["Bs"]),
  team("NHL", "Buffalo", "Sabres", "BUF", "buf", []),
  team("NHL", "Calgary", "Flames", "CGY", "cgy", []),
  team("NHL", "Carolina", "Hurricanes", "CAR", "car", ["Canes"]),
  team("NHL", "Chicago", "Blackhawks", "CHI", "chi", []),
  team("NHL", "Colorado", "Avalanche", "COL", "col", ["Avs"]),
  team("NHL", "Columbus", "Blue Jackets", "CBJ", "cbj", ["Jackets"]),
  team("NHL", "Dallas", "Stars", "DAL", "dal", []),
  team("NHL", "Detroit", "Red Wings", "DET", "det", ["Wings"]),
  team("NHL", "Edmonton", "Oilers", "EDM", "edm", ["Oil"]),
  team("NHL", "Florida", "Panthers", "FLA", "fla", []),
  team("NHL", "Los Angeles", "Kings", "LAK", "la", ["LA Kings"]),
  team("NHL", "Minnesota", "Wild", "MIN", "min", []),
  team("NHL", "Montreal", "Canadiens", "MTL", "mtl", ["Habs", "Canadians"]),
  team("NHL", "Nashville", "Predators", "NSH", "nsh", ["Preds"]),
  team("NHL", "New Jersey", "Devils", "NJD", "nj", ["NJ Devils"]),
  team("NHL", "New York", "Islanders", "NYI", "nyi", ["Isles", "NY Islanders"]),
  team("NHL", "New York", "Rangers", "NYR", "nyr", ["NY Rangers"]),
  team("NHL", "Ottawa", "Senators", "OTT", "ott", ["Sens"]),
  team("NHL", "Philadelphia", "Flyers", "PHI", "phi", []),
  team("NHL", "Pittsburgh", "Penguins", "PIT", "pit", ["Pens"]),
  team("NHL", "San Jose", "Sharks", "SJS", "sj", ["SJ Sharks"]),
  team("NHL", "Seattle", "Kraken", "SEA", "sea", []),
  team("NHL", "St. Louis", "Blues", "STL", "stl", []),
  team("NHL", "Tampa Bay", "Lightning", "TBL", "tb", ["Bolts", "Lightening"]),
  team("NHL", "Toronto", "Maple Leafs", "TOR", "tor", ["Leafs"]),
  team("NHL", "Utah", "Mammoth", "UTA", "utah", ["Utah Hockey Club", "Utah HC"]),
  team("NHL", "Vancouver", "Canucks", "VAN", "van", ["Nucks"]),
  team("NHL", "Vegas", "Golden Knights", "VGK", "vgk", ["Knights"]),
  team("NHL", "Winnipeg", "Jets", "WPG", "wpg", []),
  team("NHL", "Washington", "Capitals", "WSH", "wsh", ["Caps"]),
];

/** Build a RawTeam, deriving a league-prefixed id from the mascot. */
function team(
  league: League,
  city: string,
  mascot: string,
  abbreviation: string,
  espnAbbr: string,
  aliases: string[],
): RawTeam {
  const slug = mascot
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return {
    id: `${league.toLowerCase()}-${slug}`,
    league,
    city,
    mascot,
    fullName: `${city} ${mascot}`,
    abbreviation,
    espnAbbr,
    aliases,
  };
}

/** All teams, with the logo CDN URL merged in. */
export const TEAMS: TeamData[] = RAW_TEAMS.map((t) => ({
  ...t,
  logo: teamLogoUrl(t.league, t.espnAbbr),
}));

export const TEAMS_BY_ID: Record<string, TeamData> = TEAMS.reduce(
  (acc, t) => {
    acc[t.id] = t;
    return acc;
  },
  {} as Record<string, TeamData>,
);

/** Teams belonging to any of the given leagues, in league + listed order. */
export function teamsForLeagues(leagues: League[]): TeamData[] {
  const set = new Set(leagues);
  return TEAMS.filter((t) => set.has(t.league));
}
