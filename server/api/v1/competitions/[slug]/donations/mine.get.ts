import { useHemocioneUserAuth } from "~/server/services/auth";
import { getCompetitionBySlug } from "~/server/services/competitionService";
import { getUserDonation } from "~/server/services/donationService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const user = useHemocioneUserAuth(event);

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      "statusCode": 404,
      "statusMessage": "Competition not found"
    });
  }

  const myDonation = await getUserDonation(competition?.id, user.id);

  if (!myDonation) {
    throw createError({
      "statusCode": 404,
      "statusMessage": "Donation not found"
    });
  }

  return myDonation;
});