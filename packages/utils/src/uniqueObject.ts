/**
 * Take only unique object with specific key
 * @template T
 * @param items
 * @param uniqueKey The key of object to specific the uniqueness
 * @returns {T[]} New array with unique object
 */
export function uniqueObj<T>(items: readonly T[], uniqueKey: keyof T): T[] {
  const map = new Map<T[keyof T], T>();
  // We use for loop for high performance with large array
  for (const item of items) {
    const key = item[uniqueKey];
    if (!map.has(key)) {
      map.set(key, item);
    }
  }
  return [...map.values()];
}
