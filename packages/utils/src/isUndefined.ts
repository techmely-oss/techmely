export function isUndefined<T = any>(val?: T): val is T {
  return typeof val === "undefined";
}
