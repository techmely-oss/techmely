import { Axiom } from "@axiomhq/js";
import type { MetricEventPort, MetricsPort, Records, RuntimeEnv } from "@techmely/types";

type AxiomMetricsOptions = {
  environment: RuntimeEnv;
  dataset?: string;
  meta?: Records;
};

export class AxiomMetrics implements MetricsPort {
  readonly #axiomDataset: string;
  readonly #ax: Axiom;
  #meta: Records;

  constructor(token: string, options: AxiomMetricsOptions) {
    this.#axiomDataset = options.dataset || `cf_api_metrics_${options.environment}`;
    this.#ax = new Axiom({ token });
    this.#meta = options.meta || {};
  }

  emit<TMetric extends keyof MetricEventPort>(
    metric: TMetric,
    event: MetricEventPort[TMetric],
  ): void {
    this.#ax.ingest(this.#axiomDataset, [
      {
        _time: Date.now(),
        metric,
        ...this.#meta,
        ...event,
      },
    ]);
  }

  public async flush(): Promise<void> {
    try {
      await this.#ax.flush();
    } catch (error) {
      console.error("Unable to flush logs to axiom", error);
    }
  }
}
