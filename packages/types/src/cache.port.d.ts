import type { StringEnum } from "./common";

export type CacheTier = "memory" | "zone";

export interface BaseCachePort {
  key: string;
  namespace: string;
  tier: StringEnum<CacheTier> | StringEnum<CacheTier>[];
}

export type CachePortConfig = {
  /**
   * How long an entry should be fresh in milliseconds
   */
  fresh: number;
  /**
   * How long an entry should be stale in milliseconds
   *
   * Stale entries are still valid but should be refreshed in the background
   */
  stale: number;
};

export type CacheEntry<TValue> = {
  value: TValue;

  // Before this time the entry is considered fresh and valid
  freshUntil: number;

  staleUntil: number;
};

export interface CachePort<Namespaces extends Record<string, unknown>> {
  /**
   * Return the cached value
   *
   * The response will be `undefined` for cache misses or `null` when the key was not found in the origin
   *
   * The second value is true if the entry is stale and should be re-fetched from the origin
   */
  get<Name extends keyof Namespaces>(
    namespace: Name,
    key: string,
  ): [Namespaces[Name] | undefined, boolean] | Promise<[Namespaces[Name] | undefined, boolean]>;

  set<Name extends keyof Namespaces>(
    namespace: keyof Namespaces,
    key: string,
    value: Namespaces[Name],
  ): void;

  remove(namespace: keyof Namespaces, key: string): void;
}
