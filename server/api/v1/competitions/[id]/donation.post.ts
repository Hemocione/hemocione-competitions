import { getCompetition } from "~/server/services/competitionService";
import { registerDonation } from "~/server/services/donationService";

export default defineEventHandler(async (event) => {
  
    // Get includeUnpublished from query
    const competitionId = Number(getRouterParam(event, 'id'));
    if (isNaN(competitionId)) {
        throw new Error('Invalid competition id');
    }
    // Get user_name, user_email, competitionTeamId from body
    const body = await readBody(event);
    const user_name = body.user_name;
    const user_email = body.user_email;
    const competitionTeamId = body.competitionTeamId;

    const competition = await getCompetition(competitionId);

    if (!competition) {
        throw new Error('Competition not found');
    }

    const createdDonation = await registerDonation(
        competitionId,
        competitionTeamId,
        user_name,
        user_email
    );

    return {
        ...createdDonation,
    }
});