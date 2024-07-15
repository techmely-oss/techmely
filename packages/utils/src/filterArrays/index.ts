/**
 * @description Filter two arrays to find the match condition in two sides
 * @example
 *    const a1: [{ id: 1, title: 'Hello', id: 2, title: 'World' }]
 *    const a2: ['a', 'b', 'c', 'd']
 *    filterArrays(a1, a2, (a,b) => a.includes(b))
 *    ==> [{ id: 2, title: 'World' }]
 */
export function filterArrays<A, B>(arr1: A[], arr2: B[], filterCondition: (a: A, b: B) => boolean) {
  // Phase 1: O(n*m)
  // let result: A[] = []

  // for (let i = 0; i < arr1.length; i++) {
  //   const a = arr1[i];
  //   for (let j = 0; j < arr2.length; j++) {
  //     const b = arr2[j];
  //     if (filterCondition(a, b)) {
  //       result.push(a)
  //     }
  //   }
  // }
  // return result
  /**
   * reduce the lookup time for elements in arr2 to O(1), which would make the overall time complexity
   * of the function O(n), assuming the filterCondition function has a time complexity of O(1).
   */
  const set = new Set(arr2); // Convert arr2 to a Set for O(1) lookups
  const result: A[] = [];

  for (const a of arr1) {
    for (const b of set) {
      if (filterCondition(a, b)) {
        result.push(a);
        break; // Once a match is found, no need to check other elements in arr2
      }
    }
  }
  return result;
}
