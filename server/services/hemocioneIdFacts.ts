const config = useRuntimeConfig();

type GamificationFact = {
  userId: string;
  eventType: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  idempotencyKey: string;
};

// Deliberately catches internally — this is a fire-and-forget side effect called via
// runAsync/waitUntil, and a rejected promise there would surface as an unhandled
// rejection instead of failing the caller (there is no caller awaiting it to fail).
export async function postFactToHemocioneId(fact: GamificationFact) {
  try {
    await $fetch(`${config.hemocioneIdApiUrl}/internal/facts`, {
      method: "POST",
      body: { ...fact, sourceService: "hemocione-competitions" },
      headers: { "x-secret": config.hemocioneIdFactsSecret },
      timeout: 5000,
    });
  } catch (error) {
    console.error("[gamification] failed to push fact to hemocione-id", error);
  }
}
