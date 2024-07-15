import { isNotEmpty } from "./isNotEmpty";

/**
 * Use for case you validate multiple values is not empty
 *
 * @param {any} args any arguments
 * @returns {boolean} will return true if all value is not empty
 */
export function isNotEmpties(...args: any[]): boolean {
  if (args.length > 1) {
    return args.reduce((a, b) => a && isNotEmpty(b), true);
  }
  return false;
}
