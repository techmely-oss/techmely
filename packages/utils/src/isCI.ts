import { envShims } from "./env";
import { toBoolean } from "./toBoolean";

export function isCI() {
  return toBoolean(envShims().CI);
}
