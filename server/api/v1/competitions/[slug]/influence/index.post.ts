import { getCompetitionBySlug } from "~/server/services/competitionService";
import { createInfluence } from "~/server/services/influenceService";
import { useHemocioneUserAuth } from "~/server/services/auth";

interface CreateBody {
  competitionTeamId: number;
}

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  const user = useHemocioneUserAuth(event);

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }

  const body = await readBody(event);
  const { competitionTeamId } = body as CreateBody;
  if (!competitionTeamId) {
    throw createError({
      statusCode: 400,
      statusMessage: `
        Bad Request - competitionTeamId is required`,
    });
  }

  const createdInfluence = await createInfluence({
    userEmail: user.email,
    hemocioneID: user.id,
    competitionId: competition.id,
    competitionTeamId,
  });

  return createdInfluence;
});
