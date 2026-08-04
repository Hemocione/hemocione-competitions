import {
  getCompetitionBySlug,
  getCompetitionRanking,
} from "~/server/services/competitionService";

/**
 * Ranking dos times de uma competicao.
 *
 * O parametro da rota chama-se `slug`, mas este handler lia `id` — sempre
 * undefined, entao `Number(undefined)` era NaN e a rota lancava em 100% das
 * chamadas. Nenhuma pagina do front a consumia, o que explica o bug ter
 * passado sem ninguem notar.
 */
export default defineEventHandler(async (event) => {
  const slug = String(getRouterParam(event, "slug"));

  const competition = await getCompetitionBySlug(slug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }

  return await getCompetitionRanking(competition.id);
});
