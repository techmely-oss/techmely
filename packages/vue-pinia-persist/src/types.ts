import type { PiniaPluginContext, StateTree } from "pinia";

export type PersistStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

export type PersistSerializer = {
  /**
   * Serializes state into string before storing
   * @default JSON.stringify
   */
  serialize: (value: StateTree) => string;

  /**
   * Deserializes string into state before hydrating
   * @default JSON.parse
   */
  deserialize: (value: string) => StateTree;
};

export type PersistStateOptions = {
  /**
   * Storage key to use.
   * @default persist.{$store.id}
   */
  key?: string | ((id: string) => string);
  /**
   * Dot-notation paths to partially save state. Saves everything if undefined.
   * @default undefined
   */
  paths?: string[];
  storage?: PersistStorage;
  /**
   * Customer serializer to serialize/deserialize state.
   */
  serializer?: PersistSerializer;
  /**
   * When component unmount, state subscription will be automatically removed.
   * If you want to keep the subscription, set this option to true.
   * @see https://pinia.vuejs.org/core-concepts/state.html#Subscribing-to-the-state
   * @default true
   */
  detached?: boolean;
  version?: number;
  /**
   * Hook called before state is hydrated from storage.
   * @default () => {}
   */
  onBeforeRestore?: (context: PiniaPluginContext) => void;

  /**
   * Hook called after state is hydrated from storage.
   * @default () => {}
   */
  onAfterRestore?: (context: PiniaPluginContext) => void;
};

export type PersistGlobalConfig = Omit<PersistStateOptions, "key" | "version"> & {
  /**
   * Persist key prefix for all stores.
   * You can change this specifically for each store by passing `key` option.
   * @see https://team.techmely.com/modules/vue-pinia-persist#persist-key-prefix
   * @default 'persist'
   */
  key?: string;
  /**
   * Will persist all stores except the ones listed here.
   * @default undefined
   */
  persistAllExcept?: string[];
};

export type PersistMigrate = (state: StateTree, version: number) => StateTree;
export type PersistTransform = (state: StateTree) => StateTree;
export type PersistOnHydrateFailed = (error: Error) => void;

export type PersistConfig = {
  /**
   * Persists store in local-storage.
   */
  persist?: PersistStateOptions;
  /**
   * Storage to save state
   * @default "localStorage"
   */
  storage?: PersistStorage;
  /**
   * Log debug information
   */
  debug?: boolean;
  /**
   * Transforms allow you to customize the state object that gets persisted and rehydrated
   * @see https://team.techmely.com/modules/vue-pinia-persist#transfor-the-state
   * @default undefined
   */
  transform?: PersistTransform;
  /**
   * Migrate allows you to migrate persisted state from one version to another
   * @see https://team.techmely.com/modules/vue-pinia-persist#migrate-the-state
   * @default undefined
   */
  migrate?: PersistMigrate;
  onFailedRehydrate?: PersistOnHydrateFailed;
};

export type PersistMapMaterials = {
  id: string;
  storage?: PersistStorage;
  globalConfig?: PersistGlobalConfig;
};

declare module "pinia" {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> extends PersistConfig {}

  export interface PiniaCustomProperties {
    /**
     * Rehydrates store from persisted state
     * Warning: this is for advances use-cases, make sure you know what you're doing.
     * @see https://prazdevs.github.io/pinia-plugin-persistedstate/guide/advanced.html#forcing-the-rehydration
     */
    $hydrate: (opts?: { runHooks?: boolean }) => void;

    /**
     * Persists store into configured storage
     * Warning: this is for advances use-cases, make sure you know what you're doing.
     * @see https://prazdevs.github.io/pinia-plugin-persistedstate/guide/advanced.html#forcing-the-persistence
     */
    $persist: () => void;
  }
}
