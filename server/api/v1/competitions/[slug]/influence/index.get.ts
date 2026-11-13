import { getOptionalHemocioneUser } from "~/server/services/auth";
import { getPublicCompetitionInfluences } from "~/server/services/influenceService";

// Rota publica: so a projecao publica (sem e-mail e sem hemocioneID).
export default defineEventHandler(async (event) => {
  const competitionSlug = String(getRouterParam(event, "slug"));
  const viewer = getOptionalHemocioneUser(event);
  return getPublicCompetitionInfluences(competitionSlug, viewer?.id ?? null);
});
