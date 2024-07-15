export function isMap(val: unknown): val is Map<any, any> {
  return toString.call(val) === "[object Map]";
}
