// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@element-plus/nuxt', '@nuxtjs/google-fonts', "@pinia/nuxt"],
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
        process.env.HEMOCIONE_ID_API_URL ?? "https://api.id.hemocione.com.br",
    },
    hemocioneIdJwtSecretKey: process.env.HEMOCIONE_ID_JWT_SECRET_KEY ?? "hemocione"
  },
  routeRules: {
    "/competitions/:slug/register": {
      ssr: false,
    },
    "/competitions/:slug/success": {
      ssr: false,
    },
  },
})
