import { envShims } from "./env";
import { globProcess } from "./process";
import { toBoolean } from "./toBoolean";

/** Detect if `NODE_ENV` environment variable is `test` */
export function isNodeTest() {
  return globProcess.env.NODE_ENV === "test" || toBoolean(envShims().TEST);
}
