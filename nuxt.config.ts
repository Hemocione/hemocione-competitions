// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css', '~/assets/css/transitions.css', '~/assets/css/animations.css'],
  modules: ['@element-plus/nuxt', '@nuxtjs/google-fonts', "@pinia/nuxt", "@nuxt/image"],
  googleFonts: {
    families: {
      Roboto: true
    }
  },
  nitro: {
    preset: 'vercel'
  },
  runtimeConfig: {
    public: {
      authCookieKey: process.env.HEMOCIONE_AUTH_COOKIE_KEY ?? "hemocioneId",
      hemocioneIdUrl:
        process.env.HEMOCIONE_ID_URL ?? "https://id.hemocione.com.br",
      hemocioneIdApiUrl:
        process.env.HEMOCIONE_ID_API_URL ?? "https://hemocione-id.cpt.hemocione.com.br",
      cdnUploadUrl: process.env.CDN_UPLOAD_URL ?? "http://localhost:3001/api/upload",
    },
    hemocioneIdJwtSecretKey: process.env.HEMOCIONE_ID_JWT_SECRET_KEY ?? "hemocione",
    secret: process.env.API_SECRET ?? "secret",
  },
  routeRules: {
    "/competition/:slug/register": {
      ssr: false,
    },
    "/competition/:slug/success": {
      ssr: false,
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
})