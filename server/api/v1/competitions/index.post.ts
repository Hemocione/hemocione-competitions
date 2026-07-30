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
    webhook_configs,
    autoApprove,
    mode
  } = body;
  if (!name || !startsAt || !endsAt || _.isBoolean(mandatoryProof) === false) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Bad Request - name, startsAt, mandatoryProof and endsAt are required",
    });
  }

  // Sem isso um valor invalido chega no Prisma e volta 500 em vez de 400.
  if (mode !== undefined && mode !== "donation" && mode !== "participation") {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - mode must be 'donation' or 'participation'",
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
    webhook_configs,
    autoApprove,
    mode
  });

  return createdCompetition;
});
