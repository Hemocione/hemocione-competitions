import { assertSecretAuth } from "~/server/services/auth";
import { editCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const body = await readBody(event)
  const { name, startsAt, endsAt, extraFields } = body
  if (!name || !startsAt || !endsAt) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name, startsAt, and endsAt are required",
    });
  }

  const editedCompetition = await editCompetitionBySlug(competitionSlug, { name, startsAt, endsAt, extraFields });
  return editedCompetition;
});