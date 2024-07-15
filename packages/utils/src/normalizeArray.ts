/**
 * Normalize an array of elements to dictionary.
 * If `array` is undefined or
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {string} key The length of each chunk
 * @returns {Record<K, T>} Returns the new object normalized array.
 * @example

 * normalize({ id: 1, value: 'One'}, { id: 2, value: 'Two'})
 * // => { 1: { id: 1, value: 'One' }, 2: { id: 2, value: 'Two'} }
 *
 * normalize([], 'id') => {}
 * normalize(undefined, 'id') => {}
 * normalize([{ id: 1, value: 'One'}, { id: 1, value: 'One'}], 'key not in object') => {}
 *
 */
export function normalize<T>(array: T[], key: keyof T): Record<typeof key, T> {
  if (!array || array.length === 0) return {} as Record<typeof key, T>;
  return array.reduce(
    (acc, cur) => {
      const keyValue = cur[key] as string | number | undefined;
      if (keyValue) {
        return Object.assign(acc, { [keyValue]: cur });
      }
      return acc;
    },
    {} as Record<typeof key, T>,
  );
}
