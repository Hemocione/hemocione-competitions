import { getCompetitionRanking as getRankingByTeam } from "./competitionService"
import { getRankingByCompetitionId as getRankingByInstitution } from "./institutionService"
import { dbClient } from "../db"

export const getRanking = async (competitionId: number, by: any) => {
  if (by === 'institutions') {
    return await getRankingByInstitution(competitionId)
  } else {
    return await getRankingByTeam(competitionId)
  }
}

export const setTeamsForCompetition = async (competitionSlug: string, teamIds: number[]) => {
  const competition = await dbClient.competitions.findUnique({
    where: { slug: competitionSlug },
  });

  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found - Competition not found",
    })
  }

  if (competition.published) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Competition is already published. Teams can't be changed",
    });
  }

  const currentTeams = await dbClient.competitionTeams.findMany({
    where: { competitionId: competition.id },
  })

  const currentTeamIds = currentTeams.map((team) => team.teamId)
  const teamsToRemove = currentTeams.filter((team) => !teamIds.includes(team.teamId))
  const teamsToAdd = teamIds.filter((teamId) => !currentTeamIds.includes(teamId))

  await dbClient.$transaction(async (tx) => {
    await tx.competitionTeams.deleteMany({
      where: {
        competitionId: competition.id,
        teamId: { in: teamsToRemove.map((team) => team.teamId) },
      },
    });

    await tx.competitionTeams.createMany({
      data: teamsToAdd.map((teamId) => ({
        competitionId: competition.id,
        teamId,
      })),
    });
  });
}
