export function isArray<T = unknown>(val: any): val is T[] {
  return val && Array.isArray(val);
}
