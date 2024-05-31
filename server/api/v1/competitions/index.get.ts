import { getCompetitions } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  
	const query = getQuery(event);
	const includeUnpublished = query.includeUnpublished === 'true';
  const sortString = query.sort as string | null;
	const competitions = await getCompetitions(includeUnpublished, sortString);
	return competitions;
});