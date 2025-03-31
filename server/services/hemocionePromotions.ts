const config = useRuntimeConfig();

export async function sendPromotion(hemocioneId: string, name: string, competitionSlug: string) {
  return await $fetch(`https://hemocione-promotions.com/promotions/${competitionSlug}`, {
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