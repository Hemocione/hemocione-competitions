import { beforeEach, describe, expect, it, vi } from "vitest";

const jwt = vi.hoisted(() => {
  // auth.ts chama useRuntimeConfig() (auto-import do Nitro) no topo do modulo.
  (globalThis as any).useRuntimeConfig = () => ({});
  return { verifyAndReturnData: vi.fn() };
});
vi.mock("./jwt", () => jwt);

import { getOptionalHemocioneUser } from "./auth";

const eventWith = (authorization?: string) =>
  ({
    headers: new Headers(authorization ? { Authorization: authorization } : {}),
  }) as any;

describe("getOptionalHemocioneUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null without Authorization header", () => {
    expect(getOptionalHemocioneUser(eventWith())).toBeNull();
    expect(jwt.verifyAndReturnData).not.toHaveBeenCalled();
  });

  it("returns null for an empty bearer", () => {
    expect(getOptionalHemocioneUser(eventWith("Bearer "))).toBeNull();
  });

  it("returns null (not 401) for an invalid token", () => {
    jwt.verifyAndReturnData.mockImplementation(() => {
      throw new Error("invalid signature");
    });
    expect(getOptionalHemocioneUser(eventWith("Bearer bad"))).toBeNull();
  });

  it("returns the user for a valid token", () => {
    jwt.verifyAndReturnData.mockReturnValue({ id: "user-1" });
    expect(getOptionalHemocioneUser(eventWith("Bearer good"))).toEqual({
      id: "user-1",
    });
    expect(jwt.verifyAndReturnData).toHaveBeenCalledWith("good");
  });
});
