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

const getCompetitionInfluencesPromise = (competitionSlug: string) => {
  return dbClient.influence.findMany({
    select: {
      amountInfluence: true,
      user_name: true,
      code: true,
    },
    where: {
      competitions: {
        slug: competitionSlug,
      },
    },
    orderBy: {
      amountInfluence: "desc",
    },
  });
}

type CompetitionInfluences = Awaited<ReturnType<typeof getCompetitionInfluencesPromise>>;
const CompetititionInfluencesCache = new Map<string, { generatedAt: Date, influences: CompetitionInfluences }>();
const CACHE_TTL = 60 * 1000 * 5; // 5 minutes

export const getCompetitionInfluences = async (competitionSlug: string) => {
  const cacheHit = CompetititionInfluencesCache.get(competitionSlug);
  if (cacheHit && cacheHit.generatedAt.getTime() + CACHE_TTL > Date.now()) {
    return cacheHit.influences;
  }

  const influences = await getCompetitionInfluencesPromise(competitionSlug);
  CompetititionInfluencesCache.set(competitionSlug, { generatedAt: new Date(), influences });
  return influences;
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

export const getInfluenceByCodeAndCompetitionSlug = async (competitionSlug: string, code: string) => {
  const influence = await dbClient.influence.findFirst({
    where: {
      code,
      competitions: {
        slug: competitionSlug,
        has_influence: true,
      },
    },
  });

  return influence;
}