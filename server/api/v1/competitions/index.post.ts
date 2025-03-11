import _ from "lodash";
import { assertSecretAuth } from "~/server/services/auth";
import { createCompetition } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event);
  const {
    name,
    startsAt,
    endsAt,
    banner_background,
    extraFields,
    mandatoryProof,
    has_influence,
    has_likes,
    influence_controls_team,
    proof_type,
  } = body;
  if (!name || !startsAt || !endsAt || _.isBoolean(mandatoryProof) === false) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Bad Request - name, startsAt, mandatoryProof and endsAt are required",
    });
  }

  const startsAtDate = new Date(startsAt);
  const endsAtDate = new Date(endsAt);

  const createdCompetition = await createCompetition({
    name,
    startsAt: startsAtDate,
    endsAt: endsAtDate,
    mandatoryProof,
    has_influence,
    has_likes,
    banner_background,
    extraFields,
    influence_controls_team,
    proof_type,
  });
  return createdCompetition;
});
