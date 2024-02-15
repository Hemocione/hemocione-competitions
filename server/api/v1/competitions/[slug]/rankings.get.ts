import { getCompetitionRanking } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  
    const id = getRouterParam(event, 'id');

    // Check if id is a number
    if (isNaN(Number(id))) {
        throw new Error('Invalid competition id');
    }

    const ranking = await getCompetitionRanking(Number(id));
    return ranking;
});