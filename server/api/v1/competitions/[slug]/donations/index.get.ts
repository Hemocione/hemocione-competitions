import { assertSecretAuth } from "~/server/services/auth";
import { listCompetitionDonations } from "~/server/services/donationService";
import { getCompetitionBySlugForBackoffice } from "~/server/services/competitionService";

const STATUS_VALIDOS = ["pending", "approved", "rejected"] as const;
const KINDS_VALIDOS = ["donation", "participation"] as const;

const TAKE_PADRAO = 50;
const TAKE_MAXIMO = 200;
// Offset tem teto porque o Postgres varre e descarta tudo antes do OFFSET: um
// valor arbitrario faz o banco trabalhar a competicao inteira para devolver uma
// pagina vazia. 100 mil, com take de 200, da 500 paginas - alem disso, o caso de
// uso pede filtro, nao paginacao mais profunda.
const SKIP_MAXIMO = 100_000;

function lerInteiro(valor: unknown, padrao: number, minimo: number, maximo: number) {
  if (valor === undefined || valor === "") return padrao;

  const numero = Number(valor);
  if (!Number.isInteger(numero)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid pagination",
    });
  }

  return Math.min(Math.max(numero, minimo), maximo);
}

/**
 * Lista as doacoes de uma competicao.
 *
 * Existia como moderar (PUT .../donations/:id/status) sem como descobrir o que
 * moderar: nao havia nenhum GET que devolvesse os ids pendentes, so o do
 * proprio usuario. Sem esta rota, moderar pela API exige consultar o Postgres
 * na mao.
 */
export default defineEventHandler(async (event) => {
  assertSecretAuth(event);

  const slug = String(getRouterParam(event, "slug"));
  const competition = await getCompetitionBySlugForBackoffice(slug);
  if (!competition) {
    throw createError({
      statusCode: 404,
      statusMessage: "Competition not found",
    });
  }

  const query = getQuery(event);

  const status = query.status ? String(query.status) : undefined;
  if (status && !STATUS_VALIDOS.includes(status as (typeof STATUS_VALIDOS)[number])) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid status",
    });
  }

  const kind = query.kind ? String(query.kind) : undefined;
  if (kind && !KINDS_VALIDOS.includes(kind as (typeof KINDS_VALIDOS)[number])) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - Invalid kind",
    });
  }

  return await listCompetitionDonations({
    competitionId: competition.id,
    ...(status ? { status: status as (typeof STATUS_VALIDOS)[number] } : {}),
    ...(kind ? { kind: kind as (typeof KINDS_VALIDOS)[number] } : {}),
    take: lerInteiro(query.take, TAKE_PADRAO, 1, TAKE_MAXIMO),
    skip: lerInteiro(query.skip, 0, 0, SKIP_MAXIMO),
  });
});
