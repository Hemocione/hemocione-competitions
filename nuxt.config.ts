// https://nuxt.com/docs/api/configuration/nuxt-config
const getSiteUrl = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.VERCEL_ENV === undefined) {
    return "http://localhost:3000";
  }

  return "https://copa.hemocione.com.br";
};
const getCurrentEnv = () => {
  if (process.env.VERCEL_ENV === "preview") {
    return "dev";
  }

  if (process.env.VERCEL_ENV === "production") {
    return "prod";
  }

  return "dev";
};

const siteUrl = getSiteUrl();
const currentEnv = getCurrentEnv();

export default defineNuxtConfig({
  devtools: true,

  css: [
    "~/assets/css/main.css",
    "~/assets/css/transitions.css",
    "~/assets/css/animations.css",
  ],

  modules: [
    "@element-plus/nuxt",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt",
    "@nuxt/image",
    "nuxt-vercel-analytics",
    "nuxt-bugsnag",
    "@vueuse/nuxt",
  ],

  googleFonts: {
    families: {
      Roboto: [400, 500, 700, 900],
    },
  },

  nitro: {
    preset: "vercel",
  },

  runtimeConfig: {
    public: {
      authCookieKey: process.env.HEMOCIONE_AUTH_COOKIE_KEY ?? "hemocioneId",
      hemocioneIdUrl:
        process.env.HEMOCIONE_ID_URL ?? "https://id.d.hemocione.com.br",
      hemocioneIdApiUrl:
        process.env.HEMOCIONE_ID_API_URL ??
        "https://hemocione-id-dev.cpt.hemocione.com.br",
      hemocionePromotionsApiUrl: process.env.HEMOCIONE_PROMOTIONS_API_URL ?? "http://localhost:3001/api/v1",
      cdnUploadUrl:
        process.env.CDN_UPLOAD_URL ?? "http://localhost:3001/api/upload",
      instagramUrl:
        process.env.INSTAGRAM_URL ?? "https://www.instagram.com/hemocione/",
      siteUrl,
    },
    hemocioneIdIntegrationSecret:
      process.env.HEMOCIONE_ID_INTEGRATION_SECRET ?? "secret",
    hemocioneIdJwtSecretKey:
      process.env.HEMOCIONE_ID_JWT_SECRET_KEY ?? "hemocione",
    hemocionePromotionsApiSecret: process.env.HEMOCIONE_PROMOTIONS_API_SECRET ?? "secret",
    secret: process.env.API_SECRET ?? "secret",
    donationsQueueUrl: process.env.DONATIONS_QUEUE_URL ?? "queue-url",
  },

  routeRules: {
    "/competition/:slug/register": {
      ssr: false,
    },
    "/competition/:slug/success": {
      ssr: false,
    },
    "/competition/:slug/influence": {
      ssr: false,
    },
  },

  bugsnag: {
    publishRelease: true,
    disableLog: false, // might activate later
    baseUrl: siteUrl,
    config: {
      apiKey: process.env.BUGSNAG_API_KEY,
      enabledReleaseStages: ["prod", "dev"],
      releaseStage: currentEnv,
      appVersion: `${currentEnv}-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    },
  },

  app: {
    pageTransition: {
      name: "slide-left",
      mode: "out-in",
      appear: true,
    },
    layoutTransition: {
      name: "slide-left",
      mode: "out-in",
    },
  },

  image: {
    domains: ["cdn.hemocione.com.br"],
    alias: {
      cdn: "https://cdn.hemocione.com.br",
    },
  },

  compatibilityDate: "2025-03-31"
});