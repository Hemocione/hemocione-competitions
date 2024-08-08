import { getCompetitionEngagement } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  
  const engagement = await getCompetitionEngagement(competitionSlug);
  return engagement;
});
