export type GeoFailureReason =
  | "denied"
  | "timeout"
  | "unavailable"
  | "no-point-nearby";

export type ProofMetadata = {
  lat?: number;
  lng?: number;
  accuracy?: number;
  capturedAt?: Date;
  geoValidated: boolean;
  bloodBankPointId?: string;
  distanceMeters?: number;
  reason?: GeoFailureReason;
};

type Input = {
  coords: { lat: number; lng: number; accuracy?: number } | null;
  capturedAt?: Date;
  nearest?: { pointId: string; distanceMeters: number } | null;
  maxDistanceMeters?: number;
  reason?: GeoFailureReason;
};

/**
 * Monta o proof_metadata de um registro de participacao.
 *
 * NUNCA lanca: geolocalizacao e enriquecimento de prova, nao gate. Nada aqui
 * pode impedir alguem de registrar participacao — nem permissao negada, nem
 * app antigo sem allow="geolocation", nem ondedoar fora do ar.
 *
 * As coordenadas sao guardadas mesmo quando nenhum banco de sangue esta dentro
 * do raio, para dar visibilidade sem bloquear registro.
 */
export function resolveGeoValidation(input: Input): ProofMetadata {
  const {
    coords,
    capturedAt,
    nearest,
    maxDistanceMeters = 500,
    reason,
  } = input;

  if (!coords) {
    return { geoValidated: false, reason: reason ?? "unavailable" };
  }

  const base: ProofMetadata = {
    lat: coords.lat,
    lng: coords.lng,
    accuracy: coords.accuracy,
    capturedAt,
    geoValidated: false,
  };

  if (!nearest) {
    return { ...base, reason: "no-point-nearby" };
  }

  const withinRadius = nearest.distanceMeters <= maxDistanceMeters;

  return {
    ...base,
    geoValidated: withinRadius,
    distanceMeters: nearest.distanceMeters,
    ...(withinRadius
      ? { bloodBankPointId: nearest.pointId }
      : { reason: "no-point-nearby" as const }),
  };
}
