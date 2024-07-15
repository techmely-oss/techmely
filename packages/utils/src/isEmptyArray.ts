type EmptyArray<T> = readonly [T, ...ReadonlyArray<T>];

export function isEmptyArr<T>(array: ReadonlyArray<T> | undefined): array is EmptyArray<T> {
  return Array.isArray(array) && array?.length === 0;
}
