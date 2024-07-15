import type { CachePort, CacheTier, MetricsPort, Records } from "@techmely/types";

export class MetricsCache<NameSpaces extends Records> implements CachePort<NameSpaces> {
  #cache: CachePort<NameSpaces>;
  readonly #tier: CacheTier;
  readonly #metrics: MetricsPort;

  constructor(cache: CachePort<NameSpaces>, tier: CacheTier, metrics: MetricsPort) {
    this.#cache = cache;
    this.#tier = tier;
    this.#metrics = metrics;
  }

  async get<Name extends keyof NameSpaces>(
    namespace: Name,
    key: string,
  ): Promise<[NameSpaces[Name] | undefined, boolean]> {
    const start = performance.now();
    const [cached, stale] = await this.#cache.get(namespace, key);
    this.#metrics.emit("cacheRead", {
      hit: typeof cached !== "undefined",
      latency: performance.now() - start,
      tier: this.#tier,
      namespace: String(namespace),
      key,
    });
    return [cached, stale];
  }
  set<Name extends keyof NameSpaces>(
    namespace: keyof NameSpaces,
    key: string,
    value: NameSpaces[Name],
  ): void {
    this.#metrics.emit("cacheWrite", {
      tier: this.#tier,
      namespace: String(namespace),
      key,
    });
    this.#cache.set(namespace, key, value);
  }
  remove(namespace: keyof NameSpaces, key: string): void {
    this.#metrics.emit("cachePurge", {
      tier: this.#tier,
      namespace: String(namespace),
      key,
    });
    this.#cache.remove(namespace, key);
  }
}
