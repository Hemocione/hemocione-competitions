import { dbClient } from "../db";
import slugify from "slugify";

// status 3 = draft, 2 = ativo, 1 = upcoming, 0 = finalizado
const statusCaseWhenClause = `
CASE
  WHEN NOT published AND publication_date IS NULL THEN 3
  WHEN CURRENT_TIMESTAMP > end_at THEN 0
  WHEN CURRENT_TIMESTAMP < start_at THEN 1
  ELSE 2
END`;

export const getCompetitions = async (
  includeUnpublished = false,
  kindView: "available" | "finished"
) => {
  const orderBy: { [key: string]: string } =
    kindView === "finished" ? { end_at: "desc" } : { start_at: "asc" };

  const query = {
    where: includeUnpublished ? {} : { published: true },
    select: {
      id: true,
      name: true,
      start_at: true,
      end_at: true,
      published: true,
      publication_date: true,
      banner_background: true,
      extraFields: true,
      mandatory_proof: true,
      slug: true,
      status: statusCaseWhenClause,
    },
    orderBy,
  };

  return dbClient.competitions.findMany(query);
};

const getCompetitionBySlugPromise = (slug: string) => {
  return dbClient.competitions.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      name: true,
      start_at: true,
      end_at: true,
      published: true,
      publication_date: true,
      banner_background: true,
      extraFields: true,
      mandatory_proof: true,
      proof_type: true,
      has_influence: true,
      has_likes: true,
      competitionTeams: {
        select: {
          id: true,
          donation_count: true,
          amountLikes: true,
          teams: {
            select: {
              name: true,
              id: true,
              institutions: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

type Competition = Awaited<ReturnType<typeof getCompetitionBySlugPromise>>;
const CompetitionsBySlugCache = new Map<string, { generatedAt: Date, competition: Competition }>();
const cacheTTL = 1000 * 60 * 10; // 10 minutes

export const getCompetitionBySlug = async (slug: string) => {
  const cachedCompetition = CompetitionsBySlugCache.get(slug);
  if (cachedCompetition && Date.now() - cachedCompetition.generatedAt.getTime() < cacheTTL) {
    return cachedCompetition.competition;
  }

  const competition = await getCompetitionBySlugPromise(slug);
  CompetitionsBySlugCache.set(slug, { generatedAt: new Date(), competition });
  return competition;
};

export const getCompetition = async (id: number) => {
  const competition = await dbClient.$queryRaw`SELECT
    id,
    name,
    CASE
      WHEN NOT published AND publication_date IS NULL THEN 3
      WHEN CURRENT_TIMESTAMP > end_at THEN 0
      WHEN CURRENT_TIMESTAMP < start_at THEN 1
      ELSE 2
    END as status
    FROM Competitions
    WHERE id = ${id}`;

  return competition;
};

export const getCompetitionRanking = async (competitionId: number) => {
  const result = await dbClient.competitionTeams.findMany({
    where: {
      competitionId: competitionId,
    },
    select: {
      teamId: true,
      donation_count: true,
      teams: { select: { name: true } },
    },
    orderBy: {
      donation_count: "desc",
    },
  });

  return result;
};

export const getCompetitionEngagement = async (competitionId: number) => {
  const result = await dbClient.competitionTeams.findMany({
    where: {
      competitionId: competitionId,
    },
    select: {
      teamId: true,
      amountEngagement: true,
      teams: { select: { name: true } },
    },
    orderBy: {
      amountEngagement: "desc",
    },
  });

  return result;
}

export const createCompetition = async (
  name: string,
  startsAt: Date,
  endsAt: Date,
  mandatoryProof: boolean,
  has_influence = false,
  bannerLogoUrl?: string,
  extraFields?: ExtraFields
) => {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    locale: "pt",
  });
  return await dbClient.competitions.create({
    data: {
      name,
      slug,
      start_at: startsAt,
      end_at: endsAt,
      mandatory_proof: mandatoryProof,
      has_influence: has_influence,
      banner_background: bannerLogoUrl,
      extraFields: extraFields || ([] as any), // TODO: fix this to type ExtraFields as Prisma JSON Array type
      published: false,
    },
  });
};

export const editCompetitionBySlug = async (
  slug: string,
  payload: {
    name: string;
    startsAt: Date;
    endsAt: Date;
    banner_background?: string;
    mandatoryProof: boolean;
    extraFields?: ExtraFields;
  }
) => {
  const {
    name,
    startsAt,
    endsAt,
    extraFields,
    banner_background,
    mandatoryProof,
  } = payload;
  const updatedCompetition = await dbClient.competitions.update({
    where: { slug },
    data: {
      name,
      start_at: startsAt,
      end_at: endsAt,
      banner_background: banner_background,
      mandatory_proof: mandatoryProof,
      extraFields: extraFields || ([] as any), // TODO: fix this to type ExtraFields as Prisma JSON Array type
    },
  });
  return updatedCompetition;
};

export const publishCompetitionBySlug = async (slug: string) => {
  const publishedCompetition = await dbClient.competitions.update({
    where: { slug },
    data: {
      published: true,
      publication_date: new Date(),
    },
  });

  return publishedCompetition;
};

export const unpublishCompetitionBySlug = async (slug: string) => {
  const unpublishedCompetition = await dbClient.competitions.update({
    where: { slug },
    data: {
      published: false,
      publication_date: null,
    },
  });
  return unpublishedCompetition;
};

export const getCompetitionById = async (id: number) => {
  return await dbClient.competitions.findUnique({
    where: { id },
  });
};
