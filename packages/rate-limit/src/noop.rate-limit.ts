import type { RateLimitRequest, RateLimiterPort } from "@techmely/types";

export class NoopRateLimiter implements RateLimiterPort {
  async limit(_req: RateLimitRequest) {
    console.log("Noop limit");
    return Promise.resolve({
      current: 0,
      reset: 0,
      passed: true,
    });
  }
}
