import type { LocationQuery } from "#vue-router";
import { useUserStore } from "~/store/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  const isLoggedIn = await evaluateCurrentLogin(from.query);
  if (!isLoggedIn) {
    await redirectToID(to.fullPath);
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, url.toString());
});

export async function evaluateCurrentLogin(query?: LocationQuery) {
  const { user, setUser, setToken } = useUserStore();
  const config = useRuntimeConfig();

  if (user) return true;

  const token =
    getCurrentToken(query) ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjBjNDg5NTU3LTAwMDAtNDI4Ni05MWI4LWJmNzgwNjI3Zjg0NyIsImdpdmVuTmFtZSI6IlRoaWFnbyIsInN1ck5hbWUiOiJHdWltYXLDo2VzIiwiYmxvb2RUeXBlIjoiQSsiLCJlbWFpbCI6Imd1aW1hQGhlbW9jaW9uZS5jb20uYnIiLCJwaG9uZSI6Iis1NTIxOTg0NDI2NzE3IiwiZ2VuZGVyIjoiTSIsImRvY3VtZW50IjpudWxsLCJpYXQiOjE3NDA2ODE4NTksImV4cCI6MTc0MzI3Mzg1OX0.lkH_ZF4R1Gr4ZvZelQM8JvT09jYfiMYHq9YCr1eHX8A";

  if (!token) return false;
  let tokenIsValid = true;

  try {
    await useFetch(`${config.public.hemocioneIdApiUrl}/users/validate-token`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      onRequestError: (_error) => {
        tokenIsValid = false;
      },
      onResponseError: (_error) => {
        tokenIsValid = false;
      },
    });
  } catch (error) {
    tokenIsValid = false;
  }

  if (!tokenIsValid) {
    setUser(null);
    setToken(null);
    return false;
  }

  const currentUser = currentUserTokenDecoder(token);

  if (!currentUser) {
    return false;
  }

  setUser(currentUser);
  setToken(token);
  return true;
}

export function getCurrentToken(query?: LocationQuery): string | null {
  if (query?.token) {
    return String(query.token);
  }

  const { token } = useUserStore();
  if (token) {
    return token;
  }

  const config = useRuntimeConfig();
  const cookieToken = useCookie(config.public.authCookieKey).value as string;
  return cookieToken;
}

export function getRedirectToIdUrl(fullPath: string) {
  const origin = process.server
    ? useRuntimeConfig().public.siteUrl
    : window.location.origin;
  const redirectUrl = `${origin}${fullPath}`;
  return getHemocioneIdUrl(redirectUrl);
}

export function redirectToID(fullPath: string) {
  return navigateTo(getRedirectToIdUrl(fullPath));
}
