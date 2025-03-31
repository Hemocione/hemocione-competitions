const config = useRuntimeConfig();

export async function callWebhook(hemocioneId: string, name: string, competitionSlug: string) {
  return await $fetch(`${config.public.hemocionePromotionsApiUrl}/${competitionSlug}/trigger-async`, {
    method: "POST",
    body: {
      hemocioneId,
      name
    },
    headers: {
      "Content-Type": "application/json"
    }
  })
}