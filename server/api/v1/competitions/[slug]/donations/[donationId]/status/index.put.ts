import { assertSecretAuth } from "~/server/services/auth";
import { updateDonationStatus } from "~/server/services/donationService";
import { getCompetitionBySlugForBackoffice } from "~/server/services/competitionService";
import { waitUntil } from '@vercel/functions';
import { callWebhook } from "~/server/services/webhookService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);

  const donationId = Number(getRouterParam(event, 'donationId'));
  if (!Number.isInteger(donationId)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid donationId",
    });
  }

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

  // A competicao da rota e resolvida ANTES da mutacao. Na ordem anterior, a
  // doacao era alterada e so depois o slug era conferido: um slug inexistente
  // mudava o dado e devolvia 404, e um slug de outra competicao escolhia o
  // webhook errado.
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const competition = await getCompetitionBySlugForBackoffice(competitionSlug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found"
    });
  }

  const updatedDonation = await updateDonationStatus({
    donationId,
    competitionId: competition.id,
    status,
  });

  // Doacao inexistente ou pertencente a outra competicao: nada foi alterado.
  if (!updatedDonation) {
    throw createError({
      statusCode: 404,
      statusMessage: "Donation not found in this competition"
    });
  }

  if (updatedDonation.status === "approved" && competition.webhook_configs?.donation_approved) {
    waitUntil(callWebhook(competition.webhook_configs?.donation_approved, { hemocioneId: updatedDonation.hemocioneID }));
  }

  return updatedDonation

})
