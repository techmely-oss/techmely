import { globProcess } from "./process";

/** Detect if process.platform is macOS (darwin kernel) */
export function isMacOS() {
  return /^darwin/i.test(globProcess.platform || "");
}
