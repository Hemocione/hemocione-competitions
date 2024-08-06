import { getInfluenceByCodeAndCompetitionSlug } from "~/server/services/influenceService";

export default defineEventHandler(async (event) => {
  const influenceCode = String(getRouterParam(event, 'code'));
  const competitionSlug = String(getRouterParam(event, 'slug'));
  if (!influenceCode || !competitionSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing influenceCode",
    });
  }

  const influence = await getInfluenceByCodeAndCompetitionSlug(
    competitionSlug,
    influenceCode
  );

  if (!influence) {
    throw createError({
      statusCode: 404,
      statusMessage: "Influence not found",
    });
  }

  return influence
});