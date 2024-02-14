import type { CurrentUserData } from "~/utils/userPayloadDecoder";

interface Subscription {
    eventSlug: string;
    hemocioneId: string;
    name: string;
    code: string;
    schedule: {
        _id: unknown;
        startAt: string;
        endAt: string;
    };
}

export const useUserStore = defineStore("user", {
    state: () => ({
        user: null as CurrentUserData | null,
        token: null as string | null,
        subscriptions: new Map<string, Subscription>(),
    }),
    getters: {
        hasSubscriptionInEvent: (state) => (eventSlug: string) =>
            state.subscriptions.has(eventSlug),
    },
    actions: {
        setUser(user: CurrentUserData) {
            this.user = user;
            this.subscriptions.clear();
        },
        setToken(token: string) {
            this.token = token;
        },
    },
    // TODO: Add missing functions
});