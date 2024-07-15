/**
 * @param {number[] | number[][]} args - The input number
 * @returns {number} - Sum of array
 */
export function sum(...args: number[] | number[][]): number {
  return [...args].flat(1).reduce((a, b) => a + b, 0);
}
