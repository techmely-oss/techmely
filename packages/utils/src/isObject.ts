export function isObject(val: unknown): val is Record<string, any> {
  return toString.call(val) === "[object Object]" && !Array.isArray(val);
}
