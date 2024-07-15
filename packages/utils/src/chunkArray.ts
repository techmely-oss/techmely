/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * Returns the new array of chunks.
 * @example
 *
 * chunk(['a', 'b', 'c', 'd'], 2)
 * // => [['a', 'b'], ['c', 'd']]
 *
 * chunk(['a', 'b', 'c', 'd'], 3)
 * // => [['a', 'b', 'c'], ['d']]
 */
export function chunk<T>(array: readonly T[], size = 1): T[][] {
  if (!array || array.length === 0) {
    return [];
  }

  const chunkLength = Math.ceil(array.length / size);

  return Array.from({ length: chunkLength }, (_v, i) => {
    const start = i * size;
    return array.slice(start, start + size);
  });
}
