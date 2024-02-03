// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  modules: ['@element-plus/nuxt', '@nuxtjs/eslint-module', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      Roboto: true
    }
  },
  nitro: {
    preset: 'vercel'
  }
})
