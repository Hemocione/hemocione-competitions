import type { CurrentUserData } from "~/utils/userPayloadDecoder";

export const getUserDonation = async (
  competitionSlug: string,
  token: string
) => {
  return await $fetch(
    `/api/v1/competitions/${competitionSlug}/donations/mine`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const registerDonation = async (
  competitionSlug: string,
  token: string,
  payload: {
    proof: string;
    extraFields: ExtraFieldsResponse;
    competitionTeamId: number;
  }
) => {
  const { proof, extraFields, competitionTeamId } = payload;
  return await $fetch(`/api/v1/competitions/${competitionSlug}/donations`, {
    method: "POST",
    body: {
      competitionTeamId,
      proof,
      extraFields,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const registerInfluence = async (
  competitionSlug: string,
  token: string,
  payload: {
    competitionTeamId: number;
  }
) => {
  const { competitionTeamId } = payload;

  return await $fetch(`/api/v1/competitions/${competitionSlug}/influence`, {
    method: "POST",
    body: {
      competitionTeamId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const incrementInfluence = async (
  competitionSlug: string,
  token: string,
  payload: {
    userEmail: string;
    competitionTeamId: number;
  }
) => {
  const { userEmail, competitionTeamId } = payload;

  return await $fetch(`/api/v1/competitions/${competitionSlug}/influence`, {
    method: "PUT",
    body: {
      userEmail,
      competitionTeamId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

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
    async registerDonation(
      competitionSlug: string,
      payload: {
        proof: string;
        extraFields: ExtraFieldsResponse;
        competitionTeamId: number;
      }
    ) {
      if (!this.token) return;

      const donation = await registerDonation(
        competitionSlug,
        this.token,
        payload
      );

      this.donationsByCompetitionSlug.set(competitionSlug, donation);
      return donation;
    },
    async registerInfluence(
      competitionSlug: string,
      competitionTeamId: number
    ) {
      if (!this.token) return;

      const createdInfluence = await registerInfluence(
        competitionSlug,
        this.token,
        { competitionTeamId }
      );

      return createdInfluence;
    },
    async incrementInfluence(
      competitionSlug: string,
      userEmail: string,
      competitionTeamId: number
    ) {
      if (!this.token) return;

      const influenced = await incrementInfluence(competitionSlug, this.token, {
        userEmail,
        competitionTeamId,
      });

      return influenced;
    },
  },
});
