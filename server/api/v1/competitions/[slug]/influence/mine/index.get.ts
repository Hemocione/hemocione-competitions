import { useHemocioneUserAuth } from "~/server/services/auth";
import { getOrCreateUserInfluence } from "~/server/services/influenceService";
import { getCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  const user = useHemocioneUserAuth(event);

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }
  const now = new Date();
  const isCompetitionInPast = competition.end_at && competition.end_at < now;
  if (isCompetitionInPast) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Competition is not active",
    });
  }

  const influence = await getOrCreateUserInfluence(user, competition.id);
  const shareUrl = getInfluenceShareUrl(influence, competitionSlug);
  return { influence, shareUrl };
});
