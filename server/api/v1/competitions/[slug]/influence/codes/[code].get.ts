import { getOptionalHemocioneUser } from "~/server/services/auth";
import { getPublicInfluenceByCode } from "~/server/services/influenceService";

// Rota publica: so a projecao publica (sem e-mail e sem hemocioneID).
export default defineEventHandler(async (event) => {
  const influenceCode = String(getRouterParam(event, "code"));
  const competitionSlug = String(getRouterParam(event, "slug"));
  if (!influenceCode || !competitionSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Missing influenceCode",
    });
  }

  const viewer = getOptionalHemocioneUser(event);
  const influence = await getPublicInfluenceByCode(
    competitionSlug,
    influenceCode,
    viewer?.id ?? null
  );

  if (!influence) {
    throw createError({
      statusCode: 404,
      statusMessage: "Influence not found",
    });
  }

  return influence;
});
