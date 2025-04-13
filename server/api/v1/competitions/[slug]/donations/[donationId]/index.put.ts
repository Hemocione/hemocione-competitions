import { assertSecretAuth } from "~/server/services/auth";
import { updateDonationStatus } from "~/server/services/donationService";

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

  return updatedDonation

})