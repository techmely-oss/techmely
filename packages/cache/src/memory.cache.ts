import type { CacheEntry, CachePort, CachePortConfig, Records } from "@techmely/types";

export class MemoryCache<NameSpaces extends Records> implements CachePort<NameSpaces> {
  readonly #state: Map<`${string}:${string}`, CacheEntry<unknown>>;
  readonly #config: CachePortConfig;

  constructor(config: CachePortConfig) {
    this.#state = new Map();
    this.#config = config;
  }
  get<Name extends keyof NameSpaces>(
    namespace: Name,
    key: string,
  ): [NameSpaces[Name] | undefined, boolean] | Promise<[NameSpaces[Name] | undefined, boolean]> {
    const nameKey = `${String(namespace)}:${key}` as const;
    const cached = this.#state.get(nameKey) as CacheEntry<NameSpaces[Name]> | undefined;
    if (!cached) return [undefined, false];
    const now = Date.now();
    if (now > cached.staleUntil) {
      this.#state.delete(nameKey);
      return [undefined, false];
    }
    if (now >= cached.freshUntil) {
      return [cached.value, true];
    }
    return [cached.value, false];
  }
  set<Name extends keyof NameSpaces>(
    namespace: keyof NameSpaces,
    key: string,
    value: NameSpaces[Name],
  ): void {
    const now = Date.now();
    const nameKey = `${String(namespace)}:${key}` as const;
    this.#state.set(nameKey, {
      value,
      freshUntil: now + this.#config.fresh,
      staleUntil: now + this.#config.stale,
    });
  }
  remove(namespace: keyof NameSpaces, key: string): void {
    const nameKey = `${String(namespace)}:${key}` as const;
    this.#state.delete(nameKey);
  }
}
