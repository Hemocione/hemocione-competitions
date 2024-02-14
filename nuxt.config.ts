// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@element-plus/nuxt', '@nuxtjs/eslint-module', '@nuxtjs/google-fonts', "@pinia/nuxt"],
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
    }
  }
})
