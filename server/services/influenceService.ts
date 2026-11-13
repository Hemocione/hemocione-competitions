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

// Rotas publicas, sem login. O select e o where daqui decidem o que sai.
// user_email nunca e lido; hemocioneID e lido so para calcular isMine no
// servidor e nunca sai na resposta (ver toPublicInfluenceRow).
const getCompetitionInfluencesPromise = (competitionSlug: string) => {
  return dbClient.influence.findMany({
    select: {
      hemocioneID: true,
      amountInfluence: true,
      user_name: true,
      code: true,
    },
    where: {
      competitions: {
        slug: competitionSlug,
        published: true,
        has_influence: true,
      },
    },
    orderBy: {
      amountInfluence: "desc",
    },
  });
};

type CompetitionInfluences = Awaited<
  ReturnType<typeof getCompetitionInfluencesPromise>
>;
const CompetititionInfluencesCache = new Map<
  string,
  { generatedAt: Date; influences: CompetitionInfluences }
>();
const CACHE_TTL = 60 * 1000 * 5; // 5 minutes

const getCompetitionInfluences = async (competitionSlug: string) => {
  const cacheHit = CompetititionInfluencesCache.get(competitionSlug);
  if (cacheHit && cacheHit.generatedAt.getTime() + CACHE_TTL > Date.now()) {
    return cacheHit.influences;
  }

  const influences = await getCompetitionInfluencesPromise(competitionSlug);
  CompetititionInfluencesCache.set(competitionSlug, {
    generatedAt: new Date(),
    influences,
  });
  return influences;
};

/** "Maria Clara Souza" -> "Maria S."; um nome so fica como esta. */
export const shortUserName = (fullName: string | null | undefined) => {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

export interface PublicInfluenceRow {
  user_name: string;
  amountInfluence: number;
  code: string;
  isMine: boolean;
}

const toPublicInfluenceRow = (
  row: { hemocioneID: string; user_name: string; amountInfluence: number; code: string },
  viewerHemocioneID: string | null
): PublicInfluenceRow => ({
  user_name: shortUserName(row.user_name),
  amountInfluence: row.amountInfluence,
  code: row.code,
  isMine: Boolean(viewerHemocioneID) && row.hemocioneID === viewerHemocioneID,
});

/** Lista publica do ranking de indicacoes. Sem e-mail e sem hemocioneID. */
export const getPublicCompetitionInfluences = async (
  competitionSlug: string,
  viewerHemocioneID: string | null
): Promise<PublicInfluenceRow[]> => {
  const influences = await getCompetitionInfluences(competitionSlug);
  return influences.map((row) => toPublicInfluenceRow(row, viewerHemocioneID));
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

export const getOrCreateUserInfluence = async (
  user: HemocioneUserAuthTokenData,
  competitionId: number
) => {
  const influence = await dbClient.influence.findFirst({
    where: {
      hemocioneID: user.id,
      competitionId,
    },
  });

  if (influence) {
    return influence;
  }

  const userName = [user.givenName.trim(), user.surName.trim()]
    .join(" ")
    .trim();
  const createdInfluence = await createInfluence({
    userEmail: user.email,
    hemocioneID: user.id,
    competitionId,
    userName,
  });

  return createdInfluence;
};

export const getInfluenceByCodeAndCompetitionSlug = async (
  competitionSlug: string,
  code: string
) => {
  const influence = await dbClient.influence.findFirst({
    select: {
      id: true,
      code: true,
      user_name: true,
      competitionTeamId: true,
      hemocioneID: true,
    },
    where: {
      code,
      competitions: {
        slug: competitionSlug,
        published: true,
        has_influence: true,
      },
    },
  });

  return influence;
};

export interface PublicInfluence {
  id: number;
  code: string;
  user_name: string;
  competitionTeamId: number | null;
  isMine: boolean;
}

/** Indicacao por codigo, para a tela de registro. Sem e-mail e sem hemocioneID. */
export const getPublicInfluenceByCode = async (
  competitionSlug: string,
  code: string,
  viewerHemocioneID: string | null
): Promise<PublicInfluence | null> => {
  const influence = await getInfluenceByCodeAndCompetitionSlug(
    competitionSlug,
    code
  );
  if (!influence) return null;

  return {
    id: influence.id,
    code: influence.code,
    user_name: shortUserName(influence.user_name),
    competitionTeamId: influence.competitionTeamId ?? null,
    isMine:
      Boolean(viewerHemocioneID) && influence.hemocioneID === viewerHemocioneID,
  };
};

export const setInfluenceCompetitionTeamId = async (
  influenceId: number,
  competitionTeamId: number
) => {
  const updatedInfluence = await dbClient.influence.update({
    where: {
      id: influenceId,
    },
    data: {
      competitionTeamId,
    },
  });

  return updatedInfluence;
};
