import { describe, expect, it } from "vitest";
import { pickWinningTeam } from "./pickWinningTeam";

describe("pickWinningTeam", () => {
  it("returns the team with the highest donation_count", () => {
    const ranking = [
      { teamId: 1, donation_count: 3 },
      { teamId: 2, donation_count: 10 },
      { teamId: 3, donation_count: 7 },
    ];
    expect(pickWinningTeam(ranking)?.teamId).toBe(2);
  });

  it("returns null when there is no ranking data", () => {
    expect(pickWinningTeam([])).toBeNull();
  });

  it("returns null when every team has zero or null donation_count", () => {
    const ranking = [
      { teamId: 1, donation_count: 0 },
      { teamId: 2, donation_count: null },
    ];
    expect(pickWinningTeam(ranking)).toBeNull();
  });
});
