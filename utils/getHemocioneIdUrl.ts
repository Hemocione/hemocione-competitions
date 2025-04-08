export function getHemocioneIdUrl(redirectUrl: string): string {
  const config = useRuntimeConfig();

  const encodedRedirectUrl = encodeURIComponent(redirectUrl);
  const finalUrl = `${config.public.hemocioneIdUrl}?redirect=${encodedRedirectUrl}`;
  console.log("Hemocione ID URL:", finalUrl);
  return finalUrl;
}
