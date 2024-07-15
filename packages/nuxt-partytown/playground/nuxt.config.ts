export default defineNuxtConfig({
  modules: ["../src/module"],
  runtimeConfig: {
    public: {
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID,
      gtmId: process.env.NUXT_PUBLIC_GTM_ID,
    },
  },
  partytown: {
    forward: ["gtag"],
  },
  devtools: { enabled: true },
});
