import { isEmpty } from "./isEmpty";

/**
 * Use for case you validate multiple values is not empty
 * @param args
 */
export function isEmpties(...args: any[]): boolean {
  if (args.length > 1) {
    return args.reduce((a, b) => a && isEmpty(b), true);
  }
  return false;
}
