import { assertSecretAuth } from "~/server/services/auth";
import {
  type UpdateBody,
  incrementInfluence,
} from "~/server/services/influenceService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event);
  const { userEmail, competitionTeamId } = body as UpdateBody;

  // email and teamId are required
  if (!userEmail || !competitionTeamId) {
    throw createError({
      statusCode: 400,
      statusMessage: `
        Bad Request - userEmail and competitionId are required`,
    });
  }

  const createdInfluence = await incrementInfluence({
    userEmail,
    competitionTeamId,
  });

  return createdInfluence;
});
