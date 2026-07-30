import _ from "lodash";
import { assertSecretAuth } from "~/server/services/auth";
import { editCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const competitionSlug = String(getRouterParam(event, "slug"));
  const body = await readBody(event);
  const {
    name,
    startsAt,
    endsAt,
    mandatoryProof,
    extraFields,
    banner_background,
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

  const editedCompetition = await editCompetitionBySlug(competitionSlug, {
    name,
    startsAt: startsAtDate,
    endsAt: endsAtDate,
    extraFields,
    mandatoryProof,
    banner_background,
    has_influence,
    has_likes,
    influence_controls_team,
    proof_type,
    webhook_configs,
    autoApprove,
    mode
  });

  return editedCompetition
});
