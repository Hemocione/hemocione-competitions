import { assertSecretAuth } from "~/server/services/auth";
import { createInstitution } from "~/server/services/institutionService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event);
  const { name, logo_url } = body;
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name is required",
    });
  }

  const createdInstitution = await createInstitution(name, logo_url);
  return createdInstitution;
});
