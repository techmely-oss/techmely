import { piniaPersist } from "@techmely/vue-pinia-persist";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
import type { Pinia, StateTree } from "pinia";
import { createPinia, setActivePinia } from "pinia";

export default defineNuxtPlugin<{ pinia: Pinia }>(({ vueApp, payload }) => {
  const config = useRuntimeConfig();
  const { onAfterRestore, onBeforeRestore, ...restOptions } = config.public.persist;

  const pinia = createPinia();
  pinia.use(
    piniaPersist({
      ...restOptions,
      // biome-ignore lint/security/noGlobalEval: I knew this
      onAfterRestore: onAfterRestore ? eval(onAfterRestore) : undefined,
      // biome-ignore lint/security/noGlobalEval: I knew this
      onBeforeRestore: onBeforeRestore ? eval(onBeforeRestore) : undefined,
    }),
  );

  vueApp.use(pinia);

  setActivePinia(pinia);

  if (process.server) {
    payload.pinia = pinia.state.value;
  } else if (payload?.pinia) {
    pinia.state.value = payload.pinia as Record<string, StateTree>;
  }

  return {
    provide: {
      pinia,
    },
  };
});
declare module "#app" {
  interface NuxtApp {
    $pinia: Pinia;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $pinia: Pinia;
  }
}
