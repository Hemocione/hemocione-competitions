import { assertSecretAuth } from "~/server/services/auth";
import { unpublishCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const competitionSlug = String(getRouterParam(event, 'slug'));
  await unpublishCompetitionBySlug(competitionSlug);
});