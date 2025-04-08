export function getHemocioneIdUrl(redirectUrl: string): string {
  const config = useRuntimeConfig();

  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  const hemocioneIdUrl = config.public.hemocioneIdUrl.endsWith("/")
    ? config.public.hemocioneIdUrl
    : `${config.public.hemocioneIdUrl}/`;
  const finalUrl = `${hemocioneIdUrl}?redirect=${encodedRedirectUrl}`;
  console.log("Hemocione ID URL:", finalUrl);
  return finalUrl;
}
