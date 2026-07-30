import { describe, expect, it } from "vitest";
import {
  isValidExtraFieldsResponse,
  type ExtraFields,
} from "./validateExtraFields";

const fields: ExtraFields = [
  { slug: "matricula", label: "Matrícula", required: true, type: "text" },
  { slug: "curso", label: "Curso", required: false, type: "text" },
];

describe("isValidExtraFieldsResponse", () => {
  it("aceita quando o obrigatorio esta preenchido", () => {
    expect(
      isValidExtraFieldsResponse(fields, [
        { slug: "matricula", value: "20261234" },
      ]),
    ).toBe(true);
  });

  it("aceita opcional preenchido junto", () => {
    expect(
      isValidExtraFieldsResponse(fields, [
        { slug: "matricula", value: "20261234" },
        { slug: "curso", value: "Medicina" },
      ]),
    ).toBe(true);
  });

  it("recusa quando o obrigatorio esta ausente", () => {
    expect(
      isValidExtraFieldsResponse(fields, [{ slug: "curso", value: "Medicina" }]),
    ).toBe(false);
  });

  it("recusa obrigatorio vazio ou so espacos", () => {
    expect(
      isValidExtraFieldsResponse(fields, [{ slug: "matricula", value: "" }]),
    ).toBe(false);
    expect(
      isValidExtraFieldsResponse(fields, [{ slug: "matricula", value: "   " }]),
    ).toBe(false);
  });

  it("aceita opcional ausente", () => {
    expect(
      isValidExtraFieldsResponse(fields, [
        { slug: "matricula", value: "20261234" },
      ]),
    ).toBe(true);
  });

  it("aceita qualquer resposta quando nao ha campo configurado", () => {
    expect(isValidExtraFieldsResponse([], [])).toBe(true);
  });

  it("recusa resposta que nao e array", () => {
    expect(
      isValidExtraFieldsResponse(fields, undefined as never),
    ).toBe(false);
  });

  it("recusa valor que nao e string", () => {
    expect(
      isValidExtraFieldsResponse(fields, [
        { slug: "matricula", value: 123 as never },
      ]),
    ).toBe(false);
  });
});
