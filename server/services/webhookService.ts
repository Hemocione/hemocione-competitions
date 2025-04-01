export async function callWebhook(url: string, payload: Record<string, unknown>) {
  $fetch(url, {
    method: "POST",
    body: payload,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}