import { assertSecretAuth } from "~/server/services/auth";
import { editTeam } from "~/server/services/teamService";

export default defineEventHandler(async (event) => {
  assertSecretAuth(event);
  const id = Number(getRouterParam(event, 'teamId'));
  const institutionId = Number(getRouterParam(event, 'id'));
  const body = await readBody(event)
  const { name } = body
  if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request - name is required",
    });
  }

  const updatedTeam = await editTeam(name, id, institutionId);
  return updatedTeam;
});