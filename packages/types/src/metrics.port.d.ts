import type { BaseCachePort } from "./cache.port";

export interface MetricsPort {
  /**
   * Emit stores a new metric event
   */
  emit<TMetric extends keyof MetricEventPort>(metric: TMetric, e: MetricEventPort[TMetric]): void;

  /**
   * flush persists all metrics to durable storage
   */
  flush(): Promise<void>;
}

interface MetricCacheReadPort extends BaseCachePort {
  hit: boolean;
  latency: number;
}

export type MetricEventPort = {
  cacheRead: MetricCacheReadPort;
  cacheWrite: BaseCachePort;
  cachePurge: BaseCachePort;
  httpRequest: {
    requestId: string;
    path: string;
    method: string;
    status: number;
    latency: number;
    continent?: string;
    country?: string;
    city?: string;
    userAgent?: string;
    /**
     * Get this from redirect request header
     */
    fromAgent?: string;
    error?: string;

    // Cloudflare specific
    /**
     * See @link https://developers.cloudflare.com/workers/runtime-apis/request/#incomingrequestcfproperties
     */
    colo?: string;
  };
  rateLimit: {
    keyId: string;
    latency: number;
    tier: "memory" | "durable" | "total";
  };
  usageLimit: {
    keyId: string;
    latency: number;
  };
};
