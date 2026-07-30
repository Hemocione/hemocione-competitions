/**
 * O proofUrl pode chegar por query string: o can-donate manda a URL do
 * comprovante de pre-triagem para quem foi reprovado e vai registrar
 * participacao. Sem allowlist, o campo proof da copa viraria armazem de link
 * arbitrario.
 *
 * Compara host EXATO de proposito. endsWith deixaria passar
 * "cdn.hemocione.com.br.evil.com", e userinfo
 * ("https://cdn.hemocione.com.br@evil.com") engana leitura humana.
 */
export function isAllowedProofUrl(
  url: string | undefined | null,
  allowedHosts: string[],
): boolean {
  if (!url || !allowedHosts.length) return false;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:") return false;
  if (parsed.username || parsed.password) return false;

  return allowedHosts.includes(parsed.hostname);
}
