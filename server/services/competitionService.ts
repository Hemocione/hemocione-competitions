import { dbClient } from "../db";
import slugify from "slugify";

// status 3 = draft, 2 = ativo, 1 = upcoming, 0 = finalizado
const statusCaseWhenClause = `
CASE
  WHEN NOT published AND publication_date IS NULL THEN 3
  WHEN CURRENT_TIMESTAMP > end_at THEN 0
  WHEN CURRENT_TIMESTAMP < start_at THEN 1
  ELSE 2
END`

export const getCompetitions = async (includeUnpublished = false) => {
  const competitions = await dbClient.$queryRaw`SELECT
    id,
    name,
    start_at,
    end_at,
    CASE
      WHEN NOT published AND publication_date IS NULL THEN 3
      WHEN CURRENT_TIMESTAMP > end_at THEN 0
      WHEN CURRENT_TIMESTAMP < start_at THEN 1
      ELSE 2
    END as status
    FROM Competitions
    WHERE
      CASE
        WHEN ${includeUnpublished} THEN true
        ELSE published = true
      END
    ORDER BY status DESC, end_at DESC`;

  return competitions;
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
      extraFields: true,
      mandatory_proof: true,
      competitionTeams: {
        select: {
          id: true,
          donation_count: true,
          teams: {
            select: {
              name: true,
              id: true,
              institutions: {
                select: {
                  name: true,
                  id: true
                }
              }
            },
          }
        }
      },
    }
  });
}

type Competition = Awaited<ReturnType<typeof getCompetitionBySlugPromise>>;
const CompetitionsBySlugCache = new Map<string, Competition>();

export const getCompetitionBySlug = async (slug: string) => {
  const cachedCompetition = CompetitionsBySlugCache.get(slug);
  if (cachedCompetition) {
    return cachedCompetition;
  }

  const competition = await getCompetitionBySlugPromise(slug);
  CompetitionsBySlugCache.set(slug, competition);
  return competition;
}

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
      donation_count: 'desc',
    },
  });

  return result;
};


export const createCompetition = async (
  name: string,
  startsAt: Date,
  endsAt: Date,
  mandatoryProof: boolean,
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
      extraFields: extraFields || [] as any, // TODO: fix this to type ExtraFields as Prisma JSON Array type
      published: false,
    },
  });
};

export const editCompetitionBySlug = async (
  slug: string,
  payload: {
    name: string,
    startsAt: Date,
    endsAt: Date,
    mandatoryProof: boolean,
    extraFields?: ExtraFields,
  }
) => {
  const { name, startsAt, endsAt, extraFields, mandatoryProof } = payload;
  const updatedCompetition = await dbClient.competitions.update({
    where: { slug },
    data: {
      name,
      start_at: startsAt,
      end_at: endsAt,
      mandatory_proof: mandatoryProof,
      extraFields: extraFields || [] as any, // TODO: fix this to type ExtraFields as Prisma JSON Array type
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
