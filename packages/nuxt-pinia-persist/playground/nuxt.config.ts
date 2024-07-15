export default defineNuxtConfig({
  modules: ["../src/module.ts"],
  "pinia-persist": {
    persistAllExcept: ["user"],
    onAfterRestore: (context) => {
      context.store.payment = "VISA";
      console.log("onAfterRestore");
    },
  },
  devtools: { enabled: true },
  experimental: {
    headNext: true,
    componentIslands: true,
    viewTransition: true,
    writeEarlyHints: true,
    typedPages: true,
  },
});
