import { dbClient } from "~/server/db";
import { getCompetitionRanking } from "./competitionService";
import { pickWinningTeam } from "./pickWinningTeam";

type Fact = {
  userId: string;
  eventType: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  idempotencyKey: string;
};

// `updatedAt` is not a perfect proxy for "became approved just now" (any edit to the
// row bumps it), but hemocione-id's fact ingestion is idempotent by idempotencyKey —
// re-including a donation that was already approved before `since` is a harmless
// no-op downstream, so this stays simple instead of tracking an approvedAt column.
const getParticipatedFacts = async (since: Date): Promise<Fact[]> => {
  const donations = await dbClient.donations.findMany({
    where: { status: "approved", updatedAt: { gte: since }, hemocioneID: { not: null } },
  });

  return donations.map((donation) => ({
    userId: donation.hemocioneID as string,
    eventType: "competition.participated",
    occurredAt: donation.updatedAt.toISOString(),
    payload: { competitionId: donation.competitionId, kind: donation.kind },
    idempotencyKey: `hemocione-competitions:competition.participated:donation-${donation.id}`,
  }));
};

const getWonFacts = async (since: Date): Promise<Fact[]> => {
  const finishedCompetitions = await dbClient.competitions.findMany({
    where: { end_at: { gte: since, lt: new Date() } },
  });

  const facts: Fact[] = [];
  for (const competition of finishedCompetitions) {
    const ranking = await getCompetitionRanking(competition.id);
    const winner = pickWinningTeam(ranking);
    if (!winner) continue;

    const members = await dbClient.donations.findMany({
      where: { competitionTeamId: winner.teamId, competitionId: competition.id, hemocioneID: { not: null } },
    });

    for (const member of members) {
      facts.push({
        userId: member.hemocioneID as string,
        eventType: "competition.won",
        occurredAt: competition.end_at.toISOString(),
        payload: { competitionId: competition.id, teamId: winner.teamId },
        idempotencyKey: `hemocione-competitions:competition.won:${competition.id}:${member.hemocioneID}`,
      });
    }
  }
  return facts;
};

export const getReconciliationFactsSince = async (since: Date): Promise<Fact[]> => {
  const [participated, won] = await Promise.all([getParticipatedFacts(since), getWonFacts(since)]);
  return [...participated, ...won];
};
