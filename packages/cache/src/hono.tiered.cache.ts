import type { Records } from "@techmely/types";
import type { Context } from "hono";
import { TieredCache } from "./tiered.cache";

export class HonoTieredCache<NameSpaces extends Records> extends TieredCache<NameSpaces> {
  async withCache<Name extends keyof NameSpaces>(
    c: Context,
    namespace: Name,
    key: string,
    loadDistributedCache: (key: string) => Promise<NameSpaces[Name]>,
  ) {
    // First get from memory
    const [cached, stale] = await this.get(namespace, key);
    if (cached) {
      if (stale) {
        c.executionCtx.waitUntil(
          loadDistributedCache(key)
            .then((v) => this.set(namespace, key, v))
            .catch((error) => {
              console.error(error);
            }),
        );
      }
      return cached;
    }

    const value = await loadDistributedCache(key);
    this.set(namespace, key, value);
    return value;
  }
}
