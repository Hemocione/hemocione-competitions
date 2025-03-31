import { assertSecretAuth } from "~/server/services/auth";
import { sendPromotion } from "~/server/services/hemocionePromotions";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const {
    hemocioneId,
    name
  } = await readBody(event);

  const competitionSlug = String(getRouterParam(event, 'slug'));

  return sendPromotion(hemocioneId, name, competitionSlug);

});