import { getCompetitions } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  
	const query = getQuery(event);
	const includeUnpublished = query.includeUnpublished === 'true';
	const competitions = await getCompetitions(includeUnpublished);
	return competitions;
});