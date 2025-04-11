import { dbClient } from "../db";
import { runAsync } from "~/utils/runAsync";
import { buildAndSendDonationToHemocioneIdQueue } from "./hemocioneId";

export const registerDonation = async (
  competitionId: number,
  competitionTeamId: number,
  payload: {
    hemocioneID: string;
    user_name: string;
    user_email: string;
    extraFields?: string;
    proof?: string;
    influenceId?: number;
  }
) => {
  const { user_name, user_email, extraFields, hemocioneID, proof } = payload;
  const donation = await dbClient.$transaction(async (db) => {
    const createdDonation = await db.donations.create({
      data: {
        hemocioneID,
        user_name: user_name.split(" ")[0],
        user_email,
        competitionTeamId: competitionTeamId,
        competitionId: competitionId,
        influenceId: payload.influenceId,
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

    if (payload.influenceId) {
      await db.influence.update({
        where: {
          id: payload.influenceId,
        },
        data: {
          amountInfluence: {
            increment: 1,
          },
        },
      });
    }
    return createdDonation;
  });
  runAsync(buildAndSendDonationToHemocioneIdQueue(donation, competitionId));
  return donation;
};

export const getUserDonation = async (
  competitionId: number,
  hemocioneID: string
) => {
  return await dbClient.donations.findFirst({
    where: {
      competitionId,
      hemocioneID,
    },
  });
};

export const getCompetitionUserDonations = async (data: {
  hemocioneId: string;
  email: string;
}) => {
  const { hemocioneId, email } = data;
  return await dbClient.donations.findMany({
    select: {
      id: true,
      donationDate: true,
      createdAt: true,
      proof: true,
      competitions: {
        select: {
          id: true,
          name: true,
          mandatory_proof: true,
          published: true,
        },
      },
    },
    where: {
      OR: [
        {
          hemocioneID: hemocioneId,
        },
        {
          hemocioneID: null,
          user_email: email,
        },
      ],
      // competition should be published to be taken into account
      competitions: {
        published: true,
      },
    },
  });
};

export const updateDonationStatus = async (data: {
  donationId: number;
  status: "pending" | "approved" | "rejected";
}) => {
  const { donationId, status } = data;
  return await dbClient.donations.update({
    where: {
      id: donationId,
    },
    data: {
      status,
    },
  });
}
