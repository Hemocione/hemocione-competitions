import { dbClient } from "../db";

export interface CreateBody {
  userEmail: string;
  hemocioneID: string;
  competitionId: number;
  competitionTeamId: number;
}
export interface UpdateBody {
  userEmail: string;
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

export const createInfluence = async (data: CreateBody) => {
  const createdInfluence = await dbClient.influence.create({
    data: {
      user_email: data.userEmail,
      hemocioneID: data.hemocioneID,
      competitionId: data.competitionId,
      competitionTeamId: data.competitionTeamId,
    },
  });

  return createdInfluence;
};

export const incrementInfluence = async (data: UpdateBody) => {
  const updatedInfluence = await dbClient.influence.update({
    where: {
      influence_user_email_competitionTeamId: {
        user_email: data.userEmail,
        competitionTeamId: data.competitionTeamId,
      },
    },
    data: {
      amountInfluence: {
        increment: 1,
      },
    },
  });

  return updatedInfluence;
};
