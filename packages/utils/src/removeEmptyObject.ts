import { isDefined } from "./isDefined";
import { isNotEmpty } from "./isNotEmpty";
import { isNotNull } from "./isNotNull";

/**
 * @description Remove empty fields from an object. This will mutates the object
 * @param {any} obj - The input obj
 * @returns {any} - the clean obj
 */
export function removeEmptyObj(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => isNotNull(v) && isDefined(v) && isNotEmpty(v)),
  );
}
