import { dbClient } from "../db";

export interface CreateBody {
  userEmail: string;
  hemocioneID: string;
  competitionId: number;
  competitionTeamId: number;
}

export const getInfluences = async (competitionTeamId: number) => {
  const influence = await dbClient.influence.findMany({
    where: {
      competitionTeamId,
    },
  });

  return influence;
};

export const incrementOrCreateInfluence = async (data: CreateBody) => {

  const createdInfluence = await dbClient.influence.upsert({
    where: {
      influence_user_email_competitionTeamId: {
        user_email: data.userEmail,
        competitionTeamId: data.competitionTeamId,
      }
    },
    create: {
      user_email: data.userEmail,
      hemocioneID: data.hemocioneID,
      competitionId: data.competitionId,
      competitionTeamId: data.competitionTeamId,
      amountInfluence: 1,
    },
    update: {
      amountInfluence: {
        increment: 1,
      },
    },
  });

  return createdInfluence;
};
