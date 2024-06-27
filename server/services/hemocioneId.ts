import { getCompetitionUserDonations } from "./donationService";
import { dbClient } from "../db";
import { getCompetitionById } from "./competitionService";
import { sendMessage } from "./donationQueueService";

type CreatedDonation = Awaited<ReturnType<typeof dbClient.donations.create>>;

const config = useRuntimeConfig();

export interface Donation {
  donationProviderDonationId: string;
  label: string;
  needsReview: Boolean; // indicates if the donation needs to be reviewed by Hemocione
  donationDate: Date;
  metadata?: Record<string, any> | null; // additional metadata for the donation. Needs to be a JSON object
}

export async function getUserDonations(user: {
  hemocioneId: string;
  phone: string;
  email: string;
  document: string;
}): Promise<Donation[]> {
  const userDonations = await getCompetitionUserDonations(user);
  return userDonations.map((donation) => {
    const needsReview = !Boolean(donation.proof); // if the donation has no proof, it needs to be reviewed
    return {
      donationProviderDonationId: String(donation.id),
      label: donation.competitions.name,
      needsReview,
      donationDate: donation.donationDate || donation.createdAt,
    };
  });
}

export async function buildAndSendDonationToHemocioneIdQueue(
  donation: CreatedDonation,
  competitionId: number
) {
  const competition = await getCompetitionById(competitionId);
  if (!competition) {
    console.error(`Competition with id ${competitionId} not found`);
    return;
  }
  const needsReview = !Boolean(donation.proof); // if the donation has no proof, it needs to be reviewed
  const message = {
    secret: config.hemocioneIdIntegrationSecret,
    donation: {
      donationProviderDonationId: String(donation.id),
      label: competition.name,
      needsReview,
      donationDate: donation.donationDate || donation.createdAt,
    },
    user: {
      ...(donation.hemocioneID
        ? { hemocioneId: donation.hemocioneID }
        : { email: donation.user_email }),
    },
  };
  await sendMessage(message);
}
