import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => {
  const influence = {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  };
  return { dbClient: { influence }, influence };
});

vi.mock("../db", () => ({ dbClient: db.dbClient }));

import {
  getInfluenceByCodeAndCompetitionSlug,
  getPublicCompetitionInfluences,
  getPublicInfluenceByCode,
  shortUserName,
} from "./influenceService";

// Linha como o banco guarda: tem e-mail e hemocioneID. Valores fictícios.
const fullRow = (overrides: Record<string, unknown> = {}) => ({
  id: 7,
  hemocioneID: "00000000-0000-4000-8000-000000000001",
  user_email: "pessoa@example.invalid",
  user_name: "Maria Clara Souza",
  competitionId: 3,
  code: "ABC123",
  amountInfluence: 4,
  competitionTeamId: 11,
  ...overrides,
});

const expectNoPersonalData = (value: unknown) => {
  const text = JSON.stringify(value);
  expect(text).not.toContain("user_email");
  expect(text).not.toContain("hemocioneID");
  expect(text).not.toContain("pessoa@example.invalid");
  expect(text).not.toContain("00000000-0000-4000-8000-000000000001");
};

let slugCounter = 0;
const freshSlug = () => `copa-teste-${++slugCounter}`;

describe("shortUserName", () => {
  it("keeps a single name", () => {
    expect(shortUserName("Maria")).toBe("Maria");
  });

  it("uses first name and last-surname initial", () => {
    expect(shortUserName("Maria Clara Souza")).toBe("Maria S.");
    expect(shortUserName("João Silva")).toBe("João S.");
  });

  it("trims extra spaces", () => {
    expect(shortUserName("  Ana   Lima  ")).toBe("Ana L.");
  });

  it("handles empty values", () => {
    expect(shortUserName("")).toBe("");
    expect(shortUserName("   ")).toBe("");
    expect(shortUserName(null)).toBe("");
  });
});

describe("getPublicCompetitionInfluences", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters by published and has_influence", async () => {
    db.influence.findMany.mockResolvedValue([]);
    const slug = freshSlug();

    await getPublicCompetitionInfluences(slug, null);

    const args = db.influence.findMany.mock.calls[0][0];
    expect(args.where).toEqual({
      competitions: { slug, published: true, has_influence: true },
    });
    expect(args.select.user_email).toBeUndefined();
  });

  it("returns no e-mail and no hemocioneID, even if the db returns the full row", async () => {
    db.influence.findMany.mockResolvedValue([fullRow()]);

    const result = await getPublicCompetitionInfluences(freshSlug(), null);

    expect(result).toEqual([
      { user_name: "Maria S.", amountInfluence: 4, code: "ABC123", isMine: false },
    ]);
    expectNoPersonalData(result);
  });

  it("marks only the viewer's row as isMine", async () => {
    db.influence.findMany.mockResolvedValue([
      fullRow(),
      fullRow({ hemocioneID: "other-user", code: "XYZ999", user_name: "Pedro" }),
    ]);

    const result = await getPublicCompetitionInfluences(
      freshSlug(),
      "00000000-0000-4000-8000-000000000001"
    );

    expect(result.map((r) => r.isMine)).toEqual([true, false]);
    expectNoPersonalData(result);
  });

  it("does not leak isMine between viewers through the cache", async () => {
    db.influence.findMany.mockResolvedValue([fullRow()]);
    const slug = freshSlug();

    const mine = await getPublicCompetitionInfluences(
      slug,
      "00000000-0000-4000-8000-000000000001"
    );
    const anonymous = await getPublicCompetitionInfluences(slug, null);

    expect(db.influence.findMany).toHaveBeenCalledTimes(1);
    expect(mine[0].isMine).toBe(true);
    expect(anonymous[0].isMine).toBe(false);
  });
});

describe("getInfluenceByCodeAndCompetitionSlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses an explicit select without user_email and filters published + has_influence", async () => {
    db.influence.findFirst.mockResolvedValue(null);

    await getInfluenceByCodeAndCompetitionSlug("copa", "ABC123");

    const args = db.influence.findFirst.mock.calls[0][0];
    expect(args.where).toEqual({
      code: "ABC123",
      competitions: { slug: "copa", published: true, has_influence: true },
    });
    expect(args.select).toBeDefined();
    expect(args.select.user_email).toBeUndefined();
  });
});

describe("getPublicInfluenceByCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when the code does not exist", async () => {
    db.influence.findFirst.mockResolvedValue(null);

    expect(await getPublicInfluenceByCode("copa", "NOPE", null)).toBeNull();
  });

  it("returns only the public projection, even if the db returns the full row", async () => {
    db.influence.findFirst.mockResolvedValue(fullRow());

    const result = await getPublicInfluenceByCode("copa", "ABC123", null);

    expect(result).toEqual({
      id: 7,
      code: "ABC123",
      user_name: "Maria S.",
      competitionTeamId: 11,
      isMine: false,
    });
    expectNoPersonalData(result);
  });

  it("sets isMine when the viewer owns the code", async () => {
    db.influence.findFirst.mockResolvedValue(fullRow());

    const result = await getPublicInfluenceByCode(
      "copa",
      "ABC123",
      "00000000-0000-4000-8000-000000000001"
    );

    expect(result?.isMine).toBe(true);
    expectNoPersonalData(result);
  });
});
