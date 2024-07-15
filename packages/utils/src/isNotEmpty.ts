import { isEmpty } from "./isEmpty";

export function isNotEmpty<T = unknown>(val: T): boolean {
  return !isEmpty(val);
}
