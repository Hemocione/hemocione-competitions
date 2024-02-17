import { assertSecretAuth } from "~/server/services/auth";
import { createTeamsForInstitution } from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const body = await readBody(event)
  const id = Number(getRouterParam(event, 'id'));
  const { names } = body
  if (!names || !Array.isArray(names)) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name is required",
    });
  }
  const createdTeams = await createTeamsForInstitution(id, names);
  return createdTeams;
});