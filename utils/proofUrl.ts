/** Dominio raiz da Hemocione. Qualquer subdominio dele serve como prova. */
const HEMOCIONE_ROOT_DOMAIN = "hemocione.com.br";

/**
 * O proofUrl pode chegar por query string: o can-donate manda a URL do
 * comprovante de pre-triagem, e a CDN serve as imagens enviadas. Sem allowlist,
 * o campo proof da copa viraria armazem de link arbitrario.
 *
 * A regra e "https + qualquer coisa sob hemocione.com.br", o que cobre
 * possodoar, possodoar.d, cdn e o que vier depois sem precisar de config.
 *
 * O match e na FRONTEIRA do dominio de proposito. Um endsWith cru aceitaria
 * "evil-hemocione.com.br", e userinfo ("https://cdn.hemocione.com.br@evil.com")
 * engana leitura humana — os dois sao recusados.
 */
export function isAllowedProofUrl(url: string | undefined | null): boolean {
  if (!url) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:") return false;
  if (parsed.username || parsed.password) return false;

  const host = parsed.hostname.toLowerCase();
  return (
    host === HEMOCIONE_ROOT_DOMAIN ||
    host.endsWith(`.${HEMOCIONE_ROOT_DOMAIN}`)
  );
}
