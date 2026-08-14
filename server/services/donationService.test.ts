import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const donations = {
    create: vi.fn(),
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  };
  const competitionTeams = {
    update: vi.fn(),
  };
  const influence = {
    update: vi.fn(),
  };
  const dbClient = {
    donations,
    competitionTeams,
    influence,
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<unknown>) =>
      callback(dbClient)
    ),
  };
  return { dbClient, donations, competitionTeams, influence };
});

vi.mock("../db", () => ({ dbClient: db.dbClient }));
vi.mock("~/utils/runAsync", () => ({ runAsync: vi.fn() }));
vi.mock("./hemocioneId", () => ({
  buildAndSendDonationToHemocioneIdQueue: vi.fn(),
}));

import { registerDonation, updateDonationStatus } from "./donationService";

type Kind = "donation" | "participation";
type Status = "pending" | "approved" | "rejected";

const basePayload = (overrides: {
  status: Status;
  kind: Kind;
} = { status: "pending", kind: "donation" }) => ({
  hemocioneID: "user-1",
  user_name: "John Doe",
  user_email: "john@example.com",
  status: overrides.status,
  kind: overrides.kind,
});

describe("registerDonation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.donations.create.mockResolvedValue({ id: 1 });
    db.competitionTeams.update.mockResolvedValue({});
    db.influence.update.mockResolvedValue({});
  });

  it("does not increment donation_count for a pending donation", async () => {
    await registerDonation(1, 10, basePayload({ status: "pending", kind: "donation" }));
    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });

  it("does not increment donation_count for a rejected donation", async () => {
    await registerDonation(1, 10, basePayload({ status: "rejected", kind: "donation" }));
    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });

  it("increments donation_count for an approved donation", async () => {
    await registerDonation(1, 10, basePayload({ status: "approved", kind: "donation" }));
    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { donation_count: { increment: 1 } },
    });
  });

  it("increments donation_count for a participation regardless of status", async () => {
    await registerDonation(1, 10, basePayload({ status: "pending", kind: "participation" }));
    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { donation_count: { increment: 1 } },
    });
  });
});

describe("updateDonationStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    db.donations.update.mockResolvedValue({ id: 1, status: "approved" });
  });

  it("increments donation_count when a donation goes from pending to approved", async () => {
    db.donations.findFirst.mockResolvedValue({
      id: 1,
      kind: "donation",
      status: "pending",
      competitionTeamId: 10,
    });

    await updateDonationStatus({ donationId: 1, competitionId: 1, status: "approved" });

    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { donation_count: { increment: 1 } },
    });
  });

  it("decrements donation_count when an approved donation is rejected", async () => {
    db.donations.findFirst.mockResolvedValue({
      id: 1,
      kind: "donation",
      status: "approved",
      competitionTeamId: 10,
    });

    await updateDonationStatus({ donationId: 1, competitionId: 1, status: "rejected" });

    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { donation_count: { decrement: 1 } },
    });
  });

  it("decrements donation_count when an approved donation goes back to pending", async () => {
    db.donations.findFirst.mockResolvedValue({
      id: 1,
      kind: "donation",
      status: "approved",
      competitionTeamId: 10,
    });

    await updateDonationStatus({ donationId: 1, competitionId: 1, status: "pending" });

    expect(db.competitionTeams.update).toHaveBeenCalledWith({
      where: { id: 10 },
      data: { donation_count: { decrement: 1 } },
    });
  });

  it("does not change the counter when the status does not change", async () => {
    db.donations.findFirst.mockResolvedValue({
      id: 1,
      kind: "donation",
      status: "approved",
      competitionTeamId: 10,
    });

    await updateDonationStatus({ donationId: 1, competitionId: 1, status: "approved" });

    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });

  it("never adjusts the counter for participation", async () => {
    db.donations.findFirst.mockResolvedValue({
      id: 1,
      kind: "participation",
      status: "pending",
      competitionTeamId: 10,
    });

    await updateDonationStatus({ donationId: 1, competitionId: 1, status: "approved" });

    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });

  it("returns null and does not touch the counter when the donation belongs to another competition", async () => {
    db.donations.findFirst.mockResolvedValue(null);

    const result = await updateDonationStatus({ donationId: 1, competitionId: 999, status: "approved" });

    expect(result).toBeNull();
    expect(db.donations.update).not.toHaveBeenCalled();
    expect(db.competitionTeams.update).not.toHaveBeenCalled();
  });
});
