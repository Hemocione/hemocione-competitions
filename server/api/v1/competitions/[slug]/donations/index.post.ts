import { getCompetition } from "~/server/services/competitionService";
import { registerDonation } from "~/server/services/donationService";

export default defineEventHandler(async (event) => {
    const competitionSlug = String(getRouterParam(event, 'slug'));
    // Get user_name, user_email, competitionTeamId from body
    const body = await readBody(event);
    const user_name = body.user_name;
    const user_email = body.user_email;
    const competitionTeamId = body.competitionTeamId;
    const hemocione_id = body.hemocione_id;
    const extra_fields = body.extra_fields;

    const competition = await getCompetition(competitionId);

    if (!competition) {
        throw new Error('Competition not found');
    }

    const createdDonation = await registerDonation(
        competitionId,
        competitionTeamId,
        user_name,
        user_email,
        hemocione_id,
        extra_fields
    );

    return {
        ...createdDonation,
    }
});