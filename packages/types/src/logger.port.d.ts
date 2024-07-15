import type { Records } from "./common";

export interface LoggerPort {
  info(message: string, meta?: Records): void;
  error(message: string, meta?: Records): void;
  warn(message: string, meta?: Records): void;
  debug(message: string, meta?: Records): void;
  flush(): Promise<void>;
}

export type LoggerPortLevel = "info" | "error" | "warn" | "debug";
