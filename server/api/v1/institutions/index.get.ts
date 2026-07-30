import { assertSecretAuth } from "~/server/services/auth";
import { listInstitutions } from "~/server/services/institutionService";

export default defineEventHandler(async (event) => {
  // Protegido pelo mesmo secret dos outros endpoints de backoffice: expoe a
  // estrutura de instituicoes e times, que nao e dado publico.
  assertSecretAuth(event);
  return await listInstitutions();
});
