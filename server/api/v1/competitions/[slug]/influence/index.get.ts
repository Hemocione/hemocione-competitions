import { getCompetitionInfluences } from "~/server/services/influenceService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const influences = await getCompetitionInfluences(competitionSlug);
  return influences;
});

