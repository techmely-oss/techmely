// biome-ignore lint/complexity/noBannedTypes: Need to assert Function
export function isFunction(val: any): val is Function {
  return typeof val === "function";
}
