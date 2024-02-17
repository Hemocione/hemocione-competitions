import { isBoolean } from "lodash";
import { assertSecretAuth } from "~/server/services/auth";
import { createCompetition } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event)
  const { name, startsAt, endsAt, extraFields, mandatoryProof } = body
  if (!name || !startsAt || !endsAt || isBoolean(mandatoryProof) === false) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name, startsAt, mandatoryProof and endsAt are required",
    });
  }

  const createdCompetition = await createCompetition(name, startsAt, endsAt, mandatoryProof, extraFields);
  return createdCompetition;
});