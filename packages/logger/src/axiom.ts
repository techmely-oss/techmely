import { Axiom } from "@axiomhq/js";
import type { LoggerPort, LoggerPortLevel, Records, RuntimeEnv } from "@techmely/types";
import { ConsoleLogger } from "./console";

type AxiomLoggerOptions = {
  dataset: string;
  environment: RuntimeEnv;
  meta?: Records;
};

export class AxiomLogger implements LoggerPort {
  #consoleLogger: LoggerPort;
  #axiomDataset: string;
  #ax: Axiom;
  #meta: Records;

  constructor(token: string, options: AxiomLoggerOptions) {
    this.#consoleLogger = new ConsoleLogger();
    this.#axiomDataset = options.dataset || `cf_api_log_${options.environment}`;
    this.#ax = new Axiom({ token });
    this.#meta = options.meta || {};
  }

  #combineIngestEvents(level: LoggerPortLevel, message: string, meta?: Records) {
    this.#consoleLogger[level](message, meta);
    this.#ax.ingest(this.#axiomDataset, [
      {
        level,
        _time: Date.now(),
        message,
        ...this.#meta,
        ...meta,
      },
    ]);
  }

  info(message: string, meta?: Records): void {
    this.#combineIngestEvents("info", message, meta);
  }
  error(message: string, meta?: Records): void {
    this.#combineIngestEvents("error", message, meta);
  }
  warn(message: string, meta?: Records): void {
    this.#combineIngestEvents("warn", message, meta);
  }
  debug(message: string, meta?: Records): void {
    this.#combineIngestEvents("debug", message, meta);
  }
  async flush(): Promise<void> {
    try {
      await this.#ax.flush();
    } catch (error) {
      this.#consoleLogger.error("Unnable to flush logs to axiom", error);
    }
  }
}
