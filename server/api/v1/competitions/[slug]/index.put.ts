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
  });
  return editedCompetition;
});
