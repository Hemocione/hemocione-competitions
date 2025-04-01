export function callWebhook(url: string, payload: Record<string, unknown>) {
  return $fetch(url, {
    method: "POST",
    body: payload,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}