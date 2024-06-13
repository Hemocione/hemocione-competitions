import { getCompetitionUserDonations } from "./donationService";

interface Donation {
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
