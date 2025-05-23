import { useHemocioneUserAuth } from "~/server/services/auth";
import { getCompetitionBySlug } from "~/server/services/competitionService";
import { registerDonation } from "~/server/services/donationService";
import { callWebhook } from "~/server/services/webhookService";
import { getPrettyFullName } from "~/utils/getPrettyFullName";
import { waitUntil } from '@vercel/functions';

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const user = useHemocioneUserAuth(event);

  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) {
    throw createError({
      "statusCode": 404,
      "statusMessage": "Competition not found"
    });
  }
  const now = new Date();
  const isCompetitionInFuture = competition.start_at && competition.start_at > now;
  const isCompetitionInPast = competition.end_at && competition.end_at < now;

  if (isCompetitionInFuture || isCompetitionInPast) {
    throw createError({
      "statusCode": 400,
      "statusMessage": "Bad Request - Competition is not active"
    });
  }

  const body = await readBody(event);
  const {
    proof,
    extraFields,
    competitionTeamId,
    influenceId
  } = body;


  if (!competitionTeamId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing competitionTeamId",
    });
  }

  if (competition.mandatory_proof && !proof) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing proof",
    });
  }

  if (influenceId && !competition.has_influence) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Competition does not have influence",
    });
  }
  // TODO: validate extraFields with competition.extraFields
  const payload = {
    user_name: getPrettyFullName(user.givenName, user.surName),
    user_email: user.email,
    hemocioneID: user.id,
    extraFields,
    proof,
    influenceId,
    status: competition.autoApprove ? "approved" : "pending",
  } as const

  const createdDonation = await registerDonation(
    competition.id,
    competitionTeamId,
    payload
  );

  if (createdDonation.status === "approved" && competition.webhook_configs?.donation_approved) {
    waitUntil(callWebhook(competition.webhook_configs.donation_approved, { hemocioneId: user.id }));
  }

  return createdDonation;
});