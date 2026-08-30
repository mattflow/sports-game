import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Score from "./Score";

describe("Score", () => {
  it("renders remaining counts for the selected leagues and the aggregate guessed count", () => {
    const html = renderToString(
      <Score
        guessed={3}
        remainingByLeague={[
          { league: "NBA", remaining: 28 },
          { league: "NFL", remaining: 31 },
        ]}
      />,
    );

    expect(html).toContain("Remaining by league");
    expect(html).toContain("NBA");
    expect(html).toContain(">28<");
    expect(html).toContain("NFL");
    expect(html).toContain(">31<");
    expect(html).not.toContain("MLB");
    expect(html).not.toContain("NHL");
    expect(html).toContain(">3<");
    expect(html).toContain("guessed");
  });
});
