import { getCompetitions } from "~/server/services/competitionService";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const includeUnpublished = query.includeUnpublished === "true";
  const kindView = query.kindView as "available" | "finished";

  const competitions = await getCompetitions(includeUnpublished, kindView);

  return competitions.map(({autoApprove, webhook_configs, ...competition}) => competition);
});
