import { assertSecretAuth } from "~/server/services/auth";
import { incrementOrCreateInfluence } from "~/server/services/influenceService";

interface CreateBody {
  userEmail: string;
  hemocioneID: string;
  competitionId: number;
  competitionTeamId: number;
}

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event);
  const { userEmail, hemocioneID, competitionId,  competitionTeamId } = body as CreateBody;
  if (!userEmail || !hemocioneID || !competitionId || !competitionTeamId) {
    throw createError({
      statusCode: 400,
      statusMessage: `
        Bad Request - userEmail, hemocioneID, competitionId and competitionTeamId are required`,
    });
  }

  const createdInfluence = await incrementOrCreateInfluence({
    userEmail,
    hemocioneID,
    competitionId, 
    competitionTeamId,
  });

  return createdInfluence;
});
