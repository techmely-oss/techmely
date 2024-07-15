import {
  addImports,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from "@nuxt/kit";
import { removeEmptyObj } from "@techmely/utils";
import type { PersistGlobalConfig } from "@techmely/vue-pinia-persist";
import defu from "defu";

const logger = useLogger("nuxt:pinia-persist");

export type ModuleOptions = PersistGlobalConfig;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@techmely/nuxt-pinia-persist",
    configKey: "pinia-persist",
    compatibility: {
      nuxt: ">=3.0.0",
    },
  },
  async setup(options, nuxt) {
    const { onAfterRestore, onBeforeRestore, ...restOptions } = options;
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.build.transpile.push(resolve("./runtime"));

    // Add runtime plugin before the router plugin
    // https://github.com/nuxt/framework/issues/9130
    nuxt.hook("modules:done", () => {
      addPlugin(resolve("./runtime/plugin"));
    });

    nuxt.options.runtimeConfig.public.persist = defu(
      nuxt.options.runtimeConfig.public.persist,
      restOptions,
      removeEmptyObj({
        onAfterRestore: onAfterRestore ? String(onAfterRestore) : undefined,
        onBeforeRestore: onBeforeRestore ? String(onBeforeRestore) : undefined,
      }),
    );

    // Add auto imports usePinia
    const composables = resolve("./runtime/composables");
    addImports([{ from: composables, name: "usePinia" }]);

    addImportsSources({
      from: "pinia",
      imports: ["defineStore", "acceptHMRUpdate"],
    });

    logger.success("Complete setup module");
  },
});

declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    persist: Omit<ModuleOptions, "onAfterRestore" | "onBeforeRestore"> & {
      onBeforeRestore: string;
      onAfterRestore: string;
    };
  }
}
