import { dbClient } from "../db";

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
    where: { slug },
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
          teamId: true,
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
  endsAt: Date
) => {
  return await dbClient.competitions.create({
    data: {
      name,
      start_at: startsAt,
      end_at: endsAt,
      published: false,
    },
  });
};

export const editCompetition = async (
  id: number,
  name: string,
  startsAt: Date,
  endsAt: Date
) => {
  return await dbClient.$transaction(async (dbClient) => {
    const competitionToEdit = await dbClient.competitions.findUnique({
      where: { id: id },
    });

    if (!competitionToEdit) {
      throw new Error('Competition not found');
    }

    const updatedCompetition = await dbClient.competitions.update({
      where: { id: id },
      data: {
        name,
        start_at: startsAt,
        end_at: endsAt,
      },
    });

    return updatedCompetition;
  });
};

export const deleteCompetition = async (id: number) => {
  return await dbClient.$transaction(async (db) => {
    const deletedCompetition = await db.competitions.delete({
      where: { id: id },
    });

    return deletedCompetition;
  });
};
