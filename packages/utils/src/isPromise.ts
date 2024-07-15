export function isPromise<T = any>(val: unknown): val is Promise<T> {
  // @ts-expect-error Ignore type checking
  return isObject(val) && isFunction(val.then) && isFunction(val.catch);
}
