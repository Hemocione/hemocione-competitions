import { dbClient } from "../db";

export const likeTeam = async (data: {
  hemocioneID: string;
  competitionTeamId: number;
}) => {
  const { hemocioneID, competitionTeamId } = data;

  return await dbClient.$transaction(async (db) => {
    const existingLike = await db.likes.findUnique({
      where: {
        likes_hemocioneID_competitionTeamId: {
          hemocioneID,
          competitionTeamId,
        },
      },
    });

    if (existingLike) {
      return null;
    }

    const like = await db.likes.create({
      data: {
        hemocioneID,
        competitionTeamId,
      },
    });

    await db.competitionTeams.update({
      where: {
        id: competitionTeamId,
      },
      data: {
        amountLikes: {
          increment: 1,
        },
      },
    });

    return like;
  });
};
