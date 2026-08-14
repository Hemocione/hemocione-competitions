import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const likes = {
    findUnique: vi.fn(),
    create: vi.fn(),
  };
  const competitionTeams = {
    update: vi.fn(),
  };
  const dbClient = {
    likes,
    competitionTeams,
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback(dbClient)
    ),
  };
  return { dbClient, likes, competitionTeams };
});

vi.mock("../db", () => ({ dbClient: db.dbClient }));

import { likeTeam } from "./likeService";

describe("likeTeam", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.likes.create.mockResolvedValue({
      id: 1,
      hemocioneID: "user-1",
      competitionTeamId: 10,
    });
    db.competitionTeams.update.mockResolvedValue({});
  });

  it("creates the like and increments amountLikes", async () => {
    db.likes.findUnique.mockResolvedValue(null);

    const result = await likeTeam({
      hemocioneID: "user-1",
      competitionTeamId: 10,
    });

    expect(result).toEqual({
      id: 1,
      hemocioneID: "user-1",
      competitionTeamId: 10,
    });
    expect(db.likes.create).toHaveBeenCalledWith({
      data: { hemocioneID: "user-1", competitionTeamId: 10 },
    });
    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { amountLikes: { increment: 1 } },
    });
  });

  it("returns null and does not increment twice when already liked", async () => {
    db.likes.findUnique.mockResolvedValue({
      id: 1,
      hemocioneID: "user-1",
      competitionTeamId: 10,
    });

    const result = await likeTeam({
      hemocioneID: "user-1",
      competitionTeamId: 10,
    });

    expect(result).toBeNull();
    expect(db.likes.create).not.toHaveBeenCalled();
    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });
});
