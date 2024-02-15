import { dbClient } from "../db";

export const registerDonation = async (
  competitionId: number,
  competitionTeamId: number,
  payload: {
    hemocioneID: string,
    user_name: string,
    user_email: string,
    extraFields?: string
    proof?: string
  }
) => {
  const { user_name, user_email, extraFields, hemocioneID, proof } = payload;
  return await dbClient.$transaction(async (db) => {
    const createdDonation = await db.donations.create({
      data: {
        hemocioneID,
        user_name,
        user_email,
        competitionTeamId: competitionTeamId,
        competitionId: competitionId,
        ...(extraFields ? { extraFields } : {}),
        ...(proof ? { proof } : {}),
      },
    });

    await db.competitionTeams.update({
      where: {
        id: competitionTeamId,
      },
      data: {
        donation_count: {
          increment: 1,
        },
      },
    });

    return createdDonation;
  });
};
