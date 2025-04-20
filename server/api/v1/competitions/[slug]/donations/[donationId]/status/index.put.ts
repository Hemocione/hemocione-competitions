import { assertSecretAuth } from "~/server/services/auth";
import { updateDonationStatus } from "~/server/services/donationService";
import { getCompetitionBySlug } from "~/server/services/competitionService";
import { waitUntil } from '@vercel/functions';
import { callWebhook } from "~/server/services/webhookService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);

  const donationId = Number(getRouterParam(event, 'donationId'));

  const body = await readBody(event);
  const { status } = body

  if (!status) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing status",
    });
  }
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid status",
    });
  }

  const updatedDonation = await updateDonationStatus({
    donationId,
    status,
  });

  const competitionSlug = String(getRouterParam(event, 'slug'));
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found"
    });
  }

  if (updatedDonation.status === "approved" && competition.webhook_configs?.donation_approved) {
    waitUntil(callWebhook(competition.webhook_configs?.donation_approved, { hemocioneId: updatedDonation.hemocioneID }));
  }

  return updatedDonation

})