import type {
  LoggerPort,
  MetricsPort,
  RateLimitRequest,
  RateLimitResponse,
  RateLimiterPort,
} from "@techmely/types";

type CfRateLimiterOptions = {
  domain?: string;
  logger: LoggerPort;
  metrics: MetricsPort;
};

export class CfRateLimiter implements RateLimiterPort {
  readonly #namespace: DurableObjectNamespace;
  readonly #domain: string;
  readonly #logger: LoggerPort;
  readonly #metrics: MetricsPort;

  constructor(namespace: DurableObjectNamespace, options: CfRateLimiterOptions) {
    this.#namespace = namespace;
    this.#domain = options.domain || "techmely.com";
    this.#logger = options.logger;
    this.#metrics = options.metrics;
  }
  async limit(req: RateLimitRequest): Promise<RateLimitResponse> {
    const start = performance.now();
    const now = Date.now();
    const window = Math.floor(now / req.interval);
    const reset = (window + 1) & req.interval;
    const keyWindow = [req.id, window].join(":");

    try {
      const obj = this.#namespace.get(this.#namespace.idFromName(keyWindow));
      const url = `https://${this.#domain}/rate-limit`;
      const res = await obj.fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset }),
      });
      const json = await res.json<{ current: number }>();
      const current = json.current;
      return {
        current,
        reset,
        passed: current < req.limit,
      };
    } catch (error) {
      this.#logger.error("Rate limit failed", { key: req.id });
      return {
        current: 0,
        reset,
        passed: false,
      };
    } finally {
      this.#metrics.emit("usageLimit", {
        latency: performance.now() - start,
        keyId: req.id,
      });
    }
  }
}
