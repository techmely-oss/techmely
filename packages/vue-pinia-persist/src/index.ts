import { isBrowser, noop, pick } from "@techmely/utils";
import type { PiniaPlugin, PiniaPluginContext, StateTree, Store } from "pinia";
import type { MarkRequired } from "ts-essentials";
import type {
  PersistGlobalConfig,
  PersistMapMaterials,
  PersistMigrate,
  PersistOnHydrateFailed,
  PersistStateOptions,
  PersistTransform,
} from "./types";

export * from "./types";
const DEFAULT_GLOBAL_KEY = "persist";

/**
 * Creates a pinia persistence plugin that persists state in local-storage.
 * Use for of instead of forEach, and mapPersist instead of spread operator to increase runtime performances.
 * @see https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of
 * @see https://github.com/fabian-hiller/valibot/pull/46
 */
export function piniaPersist(globalConfig?: PersistGlobalConfig): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const { store, options, pinia } = context;
    const {
      persist: persistOptions,
      storage,
      migrate,
      transform,
      onFailedRehydrate,
    } = options || {};
    const id = store.$id;
    if (globalConfig?.persistAllExcept?.includes(id)) return;

    if (pinia.state.value[id] === undefined) {
      // @ts-expect-error `_s` is a stripped @internal property
      // @see https://github.com/vuejs/pinia/blob/v2/packages/pinia/src/createPinia.ts#L54
      const originStore = pinia._s.get(id).replace("_hot:", "");
      if (originStore) {
        Promise.resolve().then(() => originStore.$persist());
      }
      return;
    }

    const persist = mapPersist({ id, storage, globalConfig }, persistOptions || {});

    store.$persist = () => {
      persistState(store.$state, persist, migrate);
    };

    store.$hydrate = ({ runHooks = true } = {}) => {
      if (runHooks) {
        persist.onBeforeRestore(context);
      }
      hydrateStore(store, persist, transform, onFailedRehydrate);
      if (runHooks) {
        persist.onAfterRestore(context);
      }
    };

    persist.onBeforeRestore(context);
    hydrateStore(store, persist, transform, onFailedRehydrate);
    persist.onAfterRestore(context);
    store.$subscribe((_, state) => void persistState(state, persist, migrate), {
      detached: persist.detached,
    });
  };
}

/**
 * Use this function instead of using spread-operator --> Increase the runtime performances
 */
function mapPersist({ id, storage, globalConfig }: PersistMapMaterials, p: PersistStateOptions) {
  const pk = p.key;
  const _key = typeof pk === "string" ? pk : typeof pk === "function" ? pk(id) : id;

  return {
    key: `${globalConfig?.key || DEFAULT_GLOBAL_KEY}.${_key}`,
    paths: p?.paths || globalConfig?.paths,
    serializer: p?.serializer ||
      globalConfig?.serializer || {
        serialize: JSON.stringify,
        deserialize: JSON.parse,
      },
    onAfterRestore: p?.onAfterRestore || globalConfig?.onAfterRestore || noop,
    onBeforeRestore: p?.onBeforeRestore || globalConfig?.onBeforeRestore || noop,
    detached: globalConfig?.detached || p?.detached !== undefined ? p.detached : true,
    version: p?.version || 1,
    storage:
      p?.storage || globalConfig?.storage || storage || isBrowser() ? localStorage : undefined,
  };
}

function hydrateStore(
  store: Store,
  { serializer, key, storage }: MarkRequired<PersistStateOptions, "serializer">,
  transform?: PersistTransform,
  onFailedRehydrate?: PersistOnHydrateFailed,
) {
  if (!isBrowser) return;
  try {
    const fromStorage = storage?.getItem(key as string);
    if (fromStorage) {
      const value = serializer.deserialize(fromStorage);
      const transformed = transform ? transform(value) : value;
      store.$patch(transformed);
    }
  } catch (error) {
    onFailedRehydrate?.(error);
    console.error(error);
  }
}

function persistState(
  state: StateTree,
  {
    serializer,
    key,
    paths,
    storage,
    version,
  }: MarkRequired<PersistStateOptions, "serializer" | "version">,
  migrate?: PersistMigrate,
) {
  if (!isBrowser) return;
  try {
    const transformedState = migrate ? migrate(state, version) : state;
    const toStore: StateTree = Array.isArray(paths)
      ? pick(transformedState, paths)
      : transformedState;
    storage?.setItem(key as string, serializer.serialize(toStore as StateTree));
  } catch (error) {
    console.error(error);
  }
}
