import { useHemocioneUserAuth } from "~/server/services/auth";
import { getCompetitionBySlug } from "~/server/services/competitionService";
import { likeTeam } from "~/server/services/likeService";

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  const teamId = Number(getRouterParam(event, "teamId"));
  const user = useHemocioneUserAuth(event);

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }

  const competitionTeam = competition.competitionTeams.find(
    (competitionTeam) => competitionTeam.id === teamId
  );

  if (!competitionTeam) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found - Team not found in this competition",
    });
  }

  const like = await likeTeam({
    hemocioneID: user.id,
    competitionTeamId: teamId,
  });

  if (like === null) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict - Ja curtiu esse time",
    });
  }

  return like;
});
