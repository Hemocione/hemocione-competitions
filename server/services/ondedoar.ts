const NEAREST_TIMEOUT_MS = 4000;

/**
 * Consulta o ondedoar pelo banco de sangue mais proximo.
 *
 * Devolve null em QUALQUER falha — rede, timeout, formato inesperado. A
 * geolocalizacao e best-effort e nao pode derrubar um registro de participacao.
 */
export async function findNearestBloodBank(
  lat: number,
  lng: number,
  maxDistanceMeters: number,
): Promise<{ pointId: string; distanceMeters: number } | null> {
  const config = useRuntimeConfig();
  const base = config.ondeDoarApiUrl as string;
  if (!base) return null;

  try {
    const url = new URL("/api/v1/points/nearest", base);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lng", String(lng));
    url.searchParams.set("maxDistance", String(maxDistanceMeters));

    const result = await $fetch<{
      point?: { _id?: string };
      distanceMeters?: number;
    } | null>(url.toString(), { timeout: NEAREST_TIMEOUT_MS });

    const pointId = result?.point?._id;
    if (!pointId || typeof result?.distanceMeters !== "number") return null;

    return { pointId: String(pointId), distanceMeters: result.distanceMeters };
  } catch (error) {
    console.warn("[ondedoar] nearest lookup failed, continuing without geo", error);
    return null;
  }
}
