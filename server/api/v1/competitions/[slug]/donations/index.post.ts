import { useHemocioneUserAuth } from "~/server/services/auth";
import { getCompetitionBySlug } from "~/server/services/competitionService";
import { registerDonation } from "~/server/services/donationService";
import { findNearestBloodBank } from "~/server/services/ondedoar";
import { callWebhook } from "~/server/services/webhookService";
import { getPrettyFullName } from "~/utils/getPrettyFullName";
import { isAllowedProofUrl } from "~/utils/proofUrl";
import { resolveGeoValidation } from "~/utils/geo";
import { runAsync } from "~/utils/runAsync";
import { postFactToHemocioneId } from "~/server/services/hemocioneIdFacts";
import {
  isValidExtraFieldsResponse,
  type ExtraFields,
  type ExtraFieldsResponse,
} from "~/utils/validateExtraFields";
import { waitUntil } from '@vercel/functions';

const MAX_GEO_DISTANCE_METERS = 500;

export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, 'slug'));
  const user = useHemocioneUserAuth(event);
  const config = useRuntimeConfig();

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
    proofUrl,
    extraFields,
    competitionTeamId,
    influenceId,
    kind: rawKind,
    geo,
  } = body;

  if (!competitionTeamId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing competitionTeamId",
    });
  }

  const isParticipationCompetition = competition.mode === "participation";
  const kind: "donation" | "participation" =
    rawKind === "participation" ? "participation" : "donation";

  if (kind === "participation" && !isParticipationCompetition) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Competition does not accept participation",
    });
  }

  // proofUrl chega por query string: e o comprovante da pre-triagem mandado pelo
  // can-donate, ou uma imagem da CDN. Aceita https sob qualquer subdominio
  // hemocione.com.br. Fora disso o valor e ignorado, nao falha o registro.
  const externalProof = isAllowedProofUrl(proofUrl) ? String(proofUrl) : undefined;

  const resolvedProof = proof || externalProof;

  if (competition.mandatory_proof && !resolvedProof) {
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

  const configuredExtraFields = (competition.extraFields ??
    []) as unknown as ExtraFields;
  if (
    Array.isArray(configuredExtraFields) &&
    configuredExtraFields.length &&
    !isValidExtraFieldsResponse(
      configuredExtraFields,
      (extraFields ?? []) as ExtraFieldsResponse,
    )
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid extraFields",
    });
  }

  // Geolocalizacao best-effort: qualquer falha resulta em geoValidated=false,
  // nunca em registro recusado.
  let proofMetadata;
  if (isParticipationCompetition) {
    const lat = Number(geo?.lat);
    const lng = Number(geo?.lng);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      const nearest = await findNearestBloodBank(
        lat,
        lng,
        MAX_GEO_DISTANCE_METERS,
      );
      proofMetadata = resolveGeoValidation({
        coords: {
          lat,
          lng,
          accuracy: Number.isFinite(Number(geo?.accuracy))
            ? Number(geo.accuracy)
            : undefined,
        },
        capturedAt: new Date(),
        nearest,
        maxDistanceMeters: MAX_GEO_DISTANCE_METERS,
      });
    } else {
      proofMetadata = resolveGeoValidation({
        coords: null,
        reason: geo?.reason,
      });
    }
  }

  const payload = {
    user_name: getPrettyFullName(user.givenName, user.surName),
    user_email: user.email,
    hemocioneID: user.id,
    extraFields,
    proof: resolvedProof,
    influenceId,
    status: competition.autoApprove ? "approved" : "pending",
    kind,
    proof_metadata: proofMetadata,
  } as const

  const createdDonation = await registerDonation(
    competition.id,
    competitionTeamId,
    payload
  );

  // Mesmo gate da fila do hemocione-id: o webhook se chama donation_approved e
  // seus consumidores esperam uma doacao. Disparar em participacao faria eles
  // contabilizarem bolsa que nao existe.
  if (
    kind === "donation" &&
    createdDonation.status === "approved" &&
    competition.webhook_configs?.donation_approved
  ) {
    waitUntil(callWebhook(competition.webhook_configs.donation_approved, { hemocioneId: user.id }));
  }

  if (createdDonation.status === "approved" && createdDonation.hemocioneID) {
    runAsync(
      postFactToHemocioneId({
        userId: createdDonation.hemocioneID,
        eventType: "competition.participated",
        occurredAt: createdDonation.createdAt.toISOString(),
        payload: { competitionId: createdDonation.competitionId, kind: createdDonation.kind },
        idempotencyKey: `hemocione-competitions:competition.participated:donation-${createdDonation.id}`,
      })
    );
  }

  return createdDonation;
});
