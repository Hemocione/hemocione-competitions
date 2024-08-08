import type { influence } from "@prisma/client";

export const getInfluenceShareUrl = (influence: influence, competitionSlug: string) => {
    const config = useRuntimeConfig();
    const siteUrl = config.public.siteUrl;
    const url = `${siteUrl}/competition/${competitionSlug}/register?code=${influence.code}`;
    return url;
}