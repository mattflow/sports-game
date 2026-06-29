import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

// Cheap render smoke test: ensures the whole tree mounts without throwing
// (catches bad hook usage / undefined access). No DOM/localStorage needed —
// loadState() swallows the missing localStorage and falls back to setup.
describe("App renders", () => {
  it("mounts the setup screen", () => {
    const html = renderToString(<App />);
    expect(html).toContain("Sports"); // header title
    expect(html).toContain("NBA"); // league toggles rendered
    expect(html).toContain("Start ·"); // setup start button
  });
});
