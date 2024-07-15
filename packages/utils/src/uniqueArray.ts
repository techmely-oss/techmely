/**
 * @description Take only unique value from an array - Only work with primitives like string, number
 * @template T
 * @param {T[]} array - The input array
 * @returns {T[]} - New array with unique value
 */
export function unique<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}
