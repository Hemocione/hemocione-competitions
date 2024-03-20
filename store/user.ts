import type { CurrentUserData } from "~/utils/userPayloadDecoder";

export const getUserDonation = async (competitionSlug: string, token: string) => {
  return await $fetch(`/api/v1/competitions/${competitionSlug}/donations/mine`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const registerDonation = async (competitionSlug: string, token: string, payload: { proof: string, extraFields: ExtraFieldsResponse, competitionTeamId: number }) => {
  const { proof, extraFields, competitionTeamId } = payload;
  return await $fetch(`/api/v1/competitions/${competitionSlug}/donations`, {
    method: "POST",
    body: {
      competitionTeamId,
      proof,
      extraFields,
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export type UserDonation = Awaited<ReturnType<typeof getUserDonation>>;

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as CurrentUserData | null,
    token: null as string | null,
    donationsByCompetitionSlug: new Map<string, UserDonation>(),
  }),
  actions: {
    setUser(user: CurrentUserData | null) {
      this.user = user;
      this.donationsByCompetitionSlug.clear();
    },
    setToken(token: string | null) {
      this.token = token;
    },
    async getDonationByCompetitionSlug(competitionSlug: string) {
      if (!this.token) return;

      if (this.donationsByCompetitionSlug.has(competitionSlug)) {
        return this.donationsByCompetitionSlug.get(competitionSlug);
      }

      try {
        const donation = await getUserDonation(competitionSlug, this.token);
        this.donationsByCompetitionSlug.set(competitionSlug, donation);
        return donation;
      } catch (error) {
        return;
      }
    },
    async registerDonation(competitionSlug: string, payload: { proof: string, extraFields: ExtraFieldsResponse, competitionTeamId: number }) {
      if (!this.token) return;

      const donation = await registerDonation(competitionSlug, this.token, payload);
      this.donationsByCompetitionSlug.set(competitionSlug, donation);
      return donation
    }
  },
});