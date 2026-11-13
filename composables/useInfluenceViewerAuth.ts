import { useUserStore } from "~/store/user";
import { getCurrentToken } from "~/middleware/auth";

/**
 * Header de auth opcional para as rotas publicas de influencia, que usam o
 * token so para calcular `isMine`. No SSR o store ainda esta vazio (o middleware
 * de auth so roda no cliente), entao o token inicial vem do cookie ou do
 * ?token=. `watch` refaz o fetch quando o store recebe o token no cliente.
 */
export function useInfluenceViewerAuth() {
  const route = useRoute();
  const userStore = useUserStore();
  const initialToken = getCurrentToken(route.query);

  const token = computed(() => userStore.token || initialToken || null);
  const headers = computed<Record<string, string>>(() =>
    token.value ? { Authorization: `Bearer ${token.value}` } : {}
  );

  return { token, headers };
}
