import { useHemocioneUserAuth } from "~/server/services/auth";
import {
  getOrCreateUserInfluence,
  setInfluenceCompetitionTeamId,
} from "~/server/services/influenceService";
import { getCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  const user = useHemocioneUserAuth(event);
  const body = await readBody(event);
  const { competitionTeamId } = body as { competitionTeamId: number };

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }
  const now = new Date();
  const isCompetitionInFuture =
    competition.start_at && competition.start_at > now;
  const isCompetitionInPast = competition.end_at && competition.end_at < now;
  if (isCompetitionInFuture || isCompetitionInPast) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Competition is not active",
    });
  }

  let influence = await getOrCreateUserInfluence(user, competition.id);
  if (influence.competitionTeamId !== competitionTeamId) {
    influence = await setInfluenceCompetitionTeamId(
      influence.id,
      competitionTeamId
    );
  }

  const shareUrl = getInfluenceShareUrl(influence, competitionSlug);
  return { influence, shareUrl };
});
