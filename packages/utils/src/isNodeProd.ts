import { envShims } from "./env";
import { globProcess } from "./process";
import { toBoolean } from "./toBoolean";

/** Detect if `NODE_ENV` environment variable is `production` */
export function isNodeProd() {
  return globProcess.env.NODE_ENV === "production" || toBoolean(envShims().PRODUCTION);
}
