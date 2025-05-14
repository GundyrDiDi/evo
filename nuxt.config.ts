// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/supabase", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  ui: {
    theme: {
      colors: ["gray"],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/",
      exclude: ["/"],
    },
  },
  imports: {
    dirs: ["types/*"],
  },
});
