export function isDate(val: unknown): val is Date {
  return toString.call(val) === "[object Date]";
}
