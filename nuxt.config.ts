// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  // srcDir: 'src/',
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxthub/core',
    '@nuxtjs/supabase',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  supabase: {
    redirect: false,
  },
})
