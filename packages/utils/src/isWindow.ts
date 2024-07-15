import { globProcess } from "./process";

/** Detect if process.platform is Windows */
export function isWindows() {
  return /^win/i.test(globProcess.platform || "");
}
