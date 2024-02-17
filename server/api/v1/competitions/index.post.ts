import { assertSecretAuth } from "~/server/services/auth";
import { createCompetition } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event)
  const { name, startsAt, endsAt } = body
  if (!name || !startsAt || !endsAt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name, startsAt, and endsAt are required",
    });
  }

  const createdCompetition = await createCompetition(name, startsAt, endsAt);
  return createdCompetition;
});