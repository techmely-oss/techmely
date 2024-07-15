/**
 * Creates an object with the unique values of an array as keys and their frequencies as the values.
 * Example: calculateFrequencies(['a', 'b', 'a', 'c', 'a', 'a', 'b']); // { a: 4, b: 2, c: 1 }
 */
export function calculateFrequencies<T = any>(arr: T[]) {
  return arr.reduce((acc, curr) => {
    // @ts-expect-error Ignore typing
    acc[curr] = (acc[curr] ?? 0) + 1;
    return acc;
  }, {});
}
