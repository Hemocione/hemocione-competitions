import { describe, expect, it } from "vitest";
import { resolveGeoValidation } from "./geo";

const capturedAt = new Date("2026-07-30T13:00:00.000Z");
const coords = { lat: -23.55, lng: -46.63, accuracy: 20 };

describe("resolveGeoValidation", () => {
  it("valida quando o ponto esta dentro do raio", () => {
    expect(
      resolveGeoValidation({
        coords,
        capturedAt,
        nearest: { pointId: "665f", distanceMeters: 137 },
        maxDistanceMeters: 500,
      }),
    ).toEqual({
      lat: -23.55,
      lng: -46.63,
      accuracy: 20,
      capturedAt,
      geoValidated: true,
      bloodBankPointId: "665f",
      distanceMeters: 137,
    });
  });

  it("valida no limite exato do raio", () => {
    const result = resolveGeoValidation({
      coords,
      capturedAt,
      nearest: { pointId: "665f", distanceMeters: 500 },
      maxDistanceMeters: 500,
    });
    expect(result.geoValidated).toBe(true);
  });

  it("nao valida fora do raio, mas guarda as coordenadas", () => {
    const result = resolveGeoValidation({
      coords,
      capturedAt,
      nearest: { pointId: "665f", distanceMeters: 900 },
      maxDistanceMeters: 500,
    });
    expect(result.geoValidated).toBe(false);
    expect(result.lat).toBe(-23.55);
    expect(result.bloodBankPointId).toBeUndefined();
    expect(result.distanceMeters).toBe(900);
    expect(result.reason).toBe("no-point-nearby");
  });

  it("nao valida quando nenhum ponto foi encontrado", () => {
    const result = resolveGeoValidation({
      coords,
      capturedAt,
      nearest: null,
      maxDistanceMeters: 500,
    });
    expect(result.geoValidated).toBe(false);
    expect(result.lat).toBe(-23.55);
    expect(result.reason).toBe("no-point-nearby");
  });

  it("registra o motivo quando a geo nao foi obtida", () => {
    expect(resolveGeoValidation({ coords: null, reason: "denied" })).toEqual({
      geoValidated: false,
      reason: "denied",
    });
    expect(resolveGeoValidation({ coords: null, reason: "timeout" })).toEqual({
      geoValidated: false,
      reason: "timeout",
    });
  });

  it("aceita 'pending' — registro antes de a pessoa responder ao prompt", () => {
    expect(resolveGeoValidation({ coords: null, reason: "pending" })).toEqual({
      geoValidated: false,
      reason: "pending",
    });
  });

  it("usa 'unavailable' como motivo padrao", () => {
    expect(resolveGeoValidation({ coords: null })).toEqual({
      geoValidated: false,
      reason: "unavailable",
    });
  });

  it("usa 500m como raio padrao", () => {
    expect(
      resolveGeoValidation({
        coords,
        nearest: { pointId: "a", distanceMeters: 499 },
      }).geoValidated,
    ).toBe(true);
    expect(
      resolveGeoValidation({
        coords,
        nearest: { pointId: "a", distanceMeters: 501 },
      }).geoValidated,
    ).toBe(false);
  });
});
