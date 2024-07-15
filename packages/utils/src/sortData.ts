import { isNumber } from "./isNumber";
import { SortDirection } from "./sortByKey";

type SortOptions = {
  locale?: string;
  shouldIgnoreZero?: boolean;
};

/**
 * sort string | number data with direction & locale
 * return positive/0/negative result as localeCompare function.
 * @param a
 * @param b
 * @param direction
 * @param options
 */
export function sortData(
  a: unknown,
  b: unknown,
  direction: SortDirection | null = SortDirection.ASC,
  options?: SortOptions,
) {
  let result = 0;
  const { locale = "vi", shouldIgnoreZero = false } = options || {};

  if (shouldIgnoreZero) {
    if (a === b) {
      return 0;
    }
    if (a === 0) {
      return 1;
    }
    if (b === 0) {
      return -1;
    }
  }

  if (isNumber(a) && isNumber(b)) {
    const aParsed = a?.toString() ?? "";
    const bParsed = b?.toString() ?? "";
    result = isNumber(a) && isNumber(b) ? a - b : aParsed.localeCompare(bParsed, locale);
  }

  return direction === SortDirection.ASC ? result : -result;
}
