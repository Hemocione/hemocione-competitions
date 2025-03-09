import { dbClient } from "../db";

export const getRankingByCompetitionId = async (competitionId: any) => {
  const id = parseInt(competitionId);
  if (!Number.isInteger(id)) return [];

  const result = await dbClient.$queryRaw`
    SELECT CAST(SUM("donation_count") as int) AS "donation_count",
           "teams"."institutionId" AS "id",
           MAX("institutions"."name") AS "name"
    FROM "competitionTeams"
    LEFT JOIN "teams" ON "competitionTeams"."teamId" = "teams"."id"
    LEFT JOIN "institutions" ON "teams"."institutionId" = "institutions"."id"
    WHERE "competitionId" = ${id}
    GROUP BY "teams"."institutionId"
    ORDER BY "donation_count" DESC
  `;

  return result;
};

export const createInstitution = async (name: string, logo_url?: string) => {
  const createdInstitution = await dbClient.institutions.create({
    data: {
      name: name,
      logo_url: logo_url,
    },
  });

  return createdInstitution;
};

export const editInstitution = async (
  id: number,
  name: string,
  logo_url?: string
) => {
  const updatedInstitution = await dbClient.institutions.update({
    where: { id: id },
    data: {
      name: name,
      logo_url: logo_url,
    },
  });

  return updatedInstitution;
};

export const deleteInstitution = async (id: number) => {
  const deletedInstitution = await dbClient.institutions.delete({
    where: { id: id },
  });

  return deletedInstitution;
};
