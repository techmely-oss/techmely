import type { LoggerPort, Records } from "@techmely/types";
import pino, { type Logger, type LoggerOptions } from "pino";

export class PinoLogger implements LoggerPort {
  #pino: Logger;

  constructor(_options?: LoggerOptions) {
    const options: LoggerOptions = {
      ..._options,
      level: process.env.LOG_LEVEL || "debug",
      timestamp: () => `,"ts": "${new Date(Date.now()).toString()}"`,
      formatters: {
        level(label: string) {
          return { level: label };
        },
      },
    };
    const log = pino(options);
    this.#pino = log;
  }

  get instance() {
    return this.#pino;
  }

  info(message: string, meta?: Records | undefined): void {
    this.#pino.info(message, meta);
  }
  error(message: string, meta?: Records | undefined): void {
    this.#pino.error(message, meta);
  }
  warn(message: string, meta?: Records | undefined): void {
    this.#pino.warn(message, meta);
  }
  debug(message: string, meta?: Records | undefined): void {
    this.#pino.debug(message, meta);
  }
  async flush(): Promise<void> {
    try {
      this.#pino.flush();
    } catch (error) {
      this.#pino.error("Unnable to flush logs to axiom", error);
    }
  }
}
