import { assertSecretAuth } from "~/server/services/auth";
import { setTeamsForCompetition } from "~/server/services/competitionTeamsService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const { teamIds } = await readBody(event);
  const competitionSlug = String(getRouterParam(event, 'slug'));

  await setTeamsForCompetition(competitionSlug, teamIds);
});