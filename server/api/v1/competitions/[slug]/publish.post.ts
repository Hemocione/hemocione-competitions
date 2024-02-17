import { assertSecretAuth } from "~/server/services/auth";
import { publishCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const competition = await publishCompetitionBySlug(competitionSlug);
  return competition;
});