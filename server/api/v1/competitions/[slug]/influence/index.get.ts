import { getInfluences } from "~/server/services/influenceService";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const competitionTeamId = Number(query.competitionTeamId);

  const influences = await getInfluences(competitionTeamId);
  return influences;
});

