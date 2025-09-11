// https://nuxt.com/docs/api/configuration/nuxt-config

const sw = true;

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/supabase",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "@pinia/nuxt",
    "@vant/nuxt",
    "@vite-pwa/nuxt",
    "@vueuse/motion/nuxt",
    "nuxt-lottie",
  ],
  css: ["~/assets/css/main.css"],
  ssr: false,
  ui: {
    theme: {
      colors: ["gray"],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/auth/callback",
      exclude: ["/", "/auth/callback"],
    },
  },
  imports: {
    dirs: ["composables/*", "composables/**", "types/*"],
  },
  vant: {},
  lottie: {
    componentName: "Lottie", // Optional: Customize the component name
    lottieFolder: "/assets/lottie", // Optional: Customize the Lottie folder path
    autoFolderCreation: true, // Optional: Auto create lottie folder (default: true)
    enableLogs: true, // Optional: Enable console logs from module (default: true)
  },
  // pwa: {
  //   strategies: sw ? "injectManifest" : "generateSW",
  //   srcDir: sw ? "service-worker" : undefined,
  //   filename: sw ? "sw.ts" : undefined,
  //   registerType: "autoUpdate",
  //   manifest: {
  //     name: "Gardios",
  //     short_name: "evo",
  //     icons: [
  //       {
  //         src: "./img/logo.png",
  //         sizes: "128x128",
  //         type: "image/png",
  //       },
  //       {
  //         src: "./img/logo.png",
  //         sizes: "512x512",
  //         type: "image/png",
  //       },
  //     ],
  //   },
  //   workbox: {
  //     globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
  //   },
  //   injectManifest: {
  //     globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
  //   },
  //   client: {
  //     installPrompt: true
  //   },
  //   devOptions: {
  //     enabled: true,
  //     suppressWarnings: true,
  //     navigateFallback: "/",
  //     navigateFallbackAllowlist: [/^\/$/],
  //     type: "module",
  //   },
  // },
});
