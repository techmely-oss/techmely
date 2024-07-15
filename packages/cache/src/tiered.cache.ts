import type { CachePort, Records } from "@techmely/types";

/**
 * TieredCache is a cache that will first check the memory cache, then the zone cache
 * TODO: move to L1 and L2 cache
 */
export class TieredCache<NameSpaces extends Records> implements CachePort<NameSpaces> {
  #tiers: CachePort<NameSpaces>[];

  constructor(...caches: CachePort<NameSpaces>[]) {
    this.#tiers = caches;
  }

  async get<Name extends keyof NameSpaces>(
    namespace: Name,
    key: string,
  ): Promise<[NameSpaces[Name] | undefined, boolean]> {
    if (this.#tiers.length === 0) {
      return [undefined, false];
    }
    for (let i = 0; i < this.#tiers.length; i++) {
      const [cached, stale] = await this.#tiers[i].get(namespace, key);
      // Found in memory
      if (cached) {
        // Set to distributed cached
        for (let j = 0; j < i; j++) {
          this.#tiers[j].set(namespace, key, cached);
        }
        return [cached, stale];
      }
    }
    return [undefined, false];
  }

  async set<Name extends keyof NameSpaces>(
    namespace: keyof NameSpaces,
    key: string,
    value: NameSpaces[Name],
  ): Promise<void> {
    await Promise.all(this.#tiers.map((t) => t.set(namespace, key, value)));
  }

  async remove(namespace: keyof NameSpaces, key: string): Promise<void> {
    await Promise.all(this.#tiers.map((t) => t.remove(namespace, key)));
  }
}
