export function findFirstDefined<T>(...args: (T | undefined)[]) {
  return args.find((arg) => arg !== undefined);
}
