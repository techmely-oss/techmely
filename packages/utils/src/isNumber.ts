export function isNumber(val: any): val is number {
  return toString.call(val) === "[object Number]";
}
