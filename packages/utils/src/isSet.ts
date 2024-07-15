export function isSet(val: unknown): val is Set<any> {
  return toString.call(val) === "[object Set]";
}
