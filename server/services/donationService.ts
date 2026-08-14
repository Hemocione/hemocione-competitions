import { dbClient } from "../db";
import { runAsync } from "~/utils/runAsync";
import { buildAndSendDonationToHemocioneIdQueue } from "./hemocioneId";
import type { ProofMetadata } from "~/utils/geo";

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
    status: "pending" | "approved" | "rejected";
    kind?: "donation" | "participation";
    proof_metadata?: ProofMetadata;
  }
) => {
  const { user_name, user_email, extraFields, hemocioneID, proof } = payload;
  const kind = payload.kind ?? "donation";

  // O ranking soma apenas doacoes aprovadas. Participacao (check-in) nao passa
  // por moderacao, entao conta na criacao. Doacao de sangue conta so depois de
  // aprovada: quem registra e depois e rejeitado nao pode contar pra sempre.
  const shouldCountOnCreation =
    kind === "participation" || payload.status === "approved";

  const donation = await dbClient.$transaction(async (db) => {
    const createdDonation = await db.donations.create({
      data: {
        hemocioneID,
        user_name: user_name.split(" ")[0],
        user_email,
        competitionTeamId: competitionTeamId,
        competitionId: competitionId,
        influenceId: payload.influenceId,
        kind,
        ...(extraFields ? { extraFields } : {}),
        ...(proof ? { proof } : {}),
        ...(payload.proof_metadata
          ? { proof_metadata: payload.proof_metadata as object }
          : {}),
        status: payload.status,
      },
    });

    if (shouldCountOnCreation) {
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
    }

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

  // GATE: participacao NAO e bolsa de sangue. Sem isso, quem registrasse
  // participacao teria uma doacao aparecendo no historico do hemocione-id.
  if (kind === "donation") {
    runAsync(buildAndSendDonationToHemocioneIdQueue(donation, competitionId));
  }

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
      // Participacao nao entra no historico de doacoes do usuario.
      kind: "donation",
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
  return await dbClient.$transaction(async (db) => {
    const previousDonation = await db.donations.findUnique({
      where: {
        id: donationId,
      },
    });

    const updatedDonation = await db.donations.update({
      where: {
        id: donationId,
      },
      data: {
        status,
      },
    });

    // O contador so acompanha doacoes de sangue de verdade. Participacao conta
    // na criacao e nunca e ajustada — o ranking participativo nao tem reversao.
    if (previousDonation?.kind === "donation") {
      const wasApproved = previousDonation.status === "approved";
      const isApproved = status === "approved";

      if (isApproved && !wasApproved) {
        await db.competitionTeams.update({
          where: {
            id: previousDonation.competitionTeamId,
          },
          data: {
            donation_count: {
              increment: 1,
            },
          },
        });
      } else if (wasApproved && !isApproved) {
        await db.competitionTeams.update({
          where: {
            id: previousDonation.competitionTeamId,
          },
          data: {
            donation_count: {
              decrement: 1,
            },
          },
        });
      }
    }

    return updatedDonation;
  });
}
