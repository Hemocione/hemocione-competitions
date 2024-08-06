import { dbClient } from "../db";
import type { HemocioneUserAuthTokenData } from "./auth";

export interface CreateBody {
  userEmail: string;
  hemocioneID: string;
  competitionId: number;
  userName: string;
}
export interface UpdateBody {
  userEmail: string;
  competitionTeamId: number;
}

export const getInfluences = async (competitionId: number) => {
  const influence = await dbClient.influence.findMany({
    where: {
      competitionId,
    },
  });

  return influence;
};

export const createInfluence = async (data: CreateBody) => {
  const randomCode = getRandomString(6);
  const createdInfluence = await dbClient.influence.create({
    data: {
      user_email: data.userEmail,
      user_name: data.userName,
      hemocioneID: data.hemocioneID,
      competitionId: data.competitionId,
      code: randomCode,
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

export const getOrCreateUserInfluence = async (user: HemocioneUserAuthTokenData, competitionId: number) => {
  const influence = await dbClient.influence.findFirst({
    where: {
      hemocioneID: user.id,
      competitionId,
    },
  });

  if (influence) {
    return influence;
  }

  const userName = [user.givenName.trim(), user.surName.trim()].join(" ").trim();
  const createdInfluence = await createInfluence({
    userEmail: user.email,
    hemocioneID: user.id,
    competitionId,
    userName
  });

  return createdInfluence;

}
