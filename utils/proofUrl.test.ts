import { describe, expect, it } from "vitest";
import { isAllowedProofUrl } from "./proofUrl";

describe("isAllowedProofUrl", () => {
  it("aceita qualquer subdominio hemocione em https", () => {
    expect(isAllowedProofUrl("https://possodoar.hemocione.com.br/comprovante/abc")).toBe(true);
    expect(isAllowedProofUrl("https://possodoar.d.hemocione.com.br/comprovante/abc")).toBe(true);
    expect(isAllowedProofUrl("https://cdn.hemocione.com.br/x.jpg")).toBe(true);
    expect(isAllowedProofUrl("https://qualquer.coisa.nova.hemocione.com.br/y")).toBe(true);
  });

  it("aceita o dominio raiz", () => {
    expect(isAllowedProofUrl("https://hemocione.com.br/x")).toBe(true);
  });

  it("aceita host em maiusculas", () => {
    expect(isAllowedProofUrl("https://CDN.Hemocione.Com.BR/x.jpg")).toBe(true);
  });

  it("recusa dominio que apenas TERMINA com o nome — nao e subdominio", () => {
    expect(isAllowedProofUrl("https://evil-hemocione.com.br/x")).toBe(false);
    expect(isAllowedProofUrl("https://naohemocione.com.br/x")).toBe(false);
  });

  it("recusa dominio que usa o nosso como prefixo", () => {
    expect(isAllowedProofUrl("https://hemocione.com.br.evil.com/x")).toBe(false);
    expect(isAllowedProofUrl("https://cdn.hemocione.com.br.evil.com/x")).toBe(false);
  });

  it("recusa host permitido usado como userinfo", () => {
    expect(isAllowedProofUrl("https://cdn.hemocione.com.br@evil.com/x")).toBe(false);
  });

  it("recusa http — o comprovante e servido por https", () => {
    expect(isAllowedProofUrl("http://cdn.hemocione.com.br/x.jpg")).toBe(false);
  });

  it("recusa esquemas nao-http", () => {
    expect(isAllowedProofUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedProofUrl("data:text/html,x")).toBe(false);
  });

  it("recusa vazio, ausente e lixo", () => {
    expect(isAllowedProofUrl(undefined)).toBe(false);
    expect(isAllowedProofUrl(null)).toBe(false);
    expect(isAllowedProofUrl("")).toBe(false);
    expect(isAllowedProofUrl("not a url")).toBe(false);
  });
});
