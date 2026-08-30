import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { TeamData } from "../data/teams.types";
import LogoTile from "./LogoTile";

const team: TeamData = {
  id: "nba-lakers",
  league: "NBA",
  city: "Los Angeles",
  mascot: "Lakers",
  fullName: "Los Angeles Lakers",
  abbreviation: "LAL",
  espnAbbr: "lal",
  aliases: [],
  logo: "/lakers.png",
};

describe("LogoTile", () => {
  it("renders unnamed logos in muted colour without blacking them out", () => {
    const html = renderToString(<LogoTile team={team} named={false} />);

    expect(html).toContain("opacity-30");
    expect(html).not.toContain("brightness");
  });

  it("renders named logos at full opacity", () => {
    const html = renderToString(<LogoTile team={team} named />);

    expect(html).not.toContain("opacity-30");
    expect(html).not.toContain("brightness");
  });
});
