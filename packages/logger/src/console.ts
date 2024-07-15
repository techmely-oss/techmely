import type { LoggerPort, Records } from "@techmely/types";

export class ConsoleLogger implements LoggerPort {
  readonly #fields?: Records;

  constructor(fields?: Records) {
    this.#fields = fields;
  }

  #combineMessage(message: string, fields?: Records) {
    const _fields = { ...fields, ...this.#fields };
    if (Object.keys(_fields).length > 0) {
      return [message, JSON.stringify(_fields)];
    }
    return [message];
  }

  info(message: string, meta?: Records): void {
    console.info(...this.#combineMessage(message, meta));
  }
  error(message: string, meta?: Records): void {
    console.error(...this.#combineMessage(message, meta));
  }
  warn(message: string, meta?: Records): void {
    console.warn(...this.#combineMessage(message, meta));
  }
  debug(message: string, meta?: Records): void {
    console.debug(...this.#combineMessage(message, meta));
  }
  flush(): Promise<void> {
    return Promise.resolve();
  }
}
