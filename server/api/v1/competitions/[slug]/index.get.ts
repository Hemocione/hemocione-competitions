import { getCompetitionBySlug } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
    });
  }
  return competition;
});