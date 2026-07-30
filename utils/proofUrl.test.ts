import { describe, expect, it } from "vitest";
import { isAllowedProofUrl } from "./proofUrl";

const allowed = [
  "possodoar.hemocione.com.br",
  "possodoar.d.hemocione.com.br",
  "cdn.hemocione.com.br",
];

describe("isAllowedProofUrl", () => {
  it("aceita host allowlistado em https", () => {
    expect(
      isAllowedProofUrl(
        "https://possodoar.hemocione.com.br/comprovante/abc",
        allowed,
      ),
    ).toBe(true);
    expect(isAllowedProofUrl("https://cdn.hemocione.com.br/x.jpg", allowed)).toBe(
      true,
    );
  });

  it("recusa host fora da allowlist", () => {
    expect(isAllowedProofUrl("https://evil.com/x.jpg", allowed)).toBe(false);
  });

  it("recusa subdominio que apenas termina com host permitido", () => {
    expect(
      isAllowedProofUrl("https://cdn.hemocione.com.br.evil.com/x", allowed),
    ).toBe(false);
  });

  it("recusa host permitido usado como userinfo", () => {
    expect(
      isAllowedProofUrl("https://cdn.hemocione.com.br@evil.com/x", allowed),
    ).toBe(false);
  });

  it("recusa http — o comprovante e servido por https", () => {
    expect(isAllowedProofUrl("http://cdn.hemocione.com.br/x.jpg", allowed)).toBe(
      false,
    );
  });

  it("recusa esquemas nao-http", () => {
    expect(isAllowedProofUrl("javascript:alert(1)", allowed)).toBe(false);
    expect(isAllowedProofUrl("data:text/html,x", allowed)).toBe(false);
  });

  it("recusa vazio, ausente e lixo", () => {
    expect(isAllowedProofUrl(undefined, allowed)).toBe(false);
    expect(isAllowedProofUrl(null, allowed)).toBe(false);
    expect(isAllowedProofUrl("", allowed)).toBe(false);
    expect(isAllowedProofUrl("not a url", allowed)).toBe(false);
  });

  it("recusa tudo quando a allowlist esta vazia", () => {
    expect(isAllowedProofUrl("https://cdn.hemocione.com.br/x.jpg", [])).toBe(
      false,
    );
  });
});
