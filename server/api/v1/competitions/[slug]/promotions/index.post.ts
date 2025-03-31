import { assertSecretAuth } from "~/server/services/auth";
import { sendPromotion } from "~/server/services/hemocionePromotions";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const {
    hemocioneId,
    name
  } = await readBody(event);

  if (!hemocioneId || !name) throw createError({
    statusCode: 400,
    statusMessage:
      "Bad Request - name and hemocioneId are required",
  });

  const competitionSlug = String(getRouterParam(event, 'slug'));

  return sendPromotion(hemocioneId, name, competitionSlug);

});