/**
 * check if all the values of an array are distinct
 * Example:
 *  isDistinctArray([1, 2, 2, 3, 4, 4, 5]); // false
    isDistinctArray([1, 2, 3, 4, 5]); // true
 */
export function isDistinctArray<T = any>(arr: T[]) {
  return arr.length === new Set(arr).size;
}
