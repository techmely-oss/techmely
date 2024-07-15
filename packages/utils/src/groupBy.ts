/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */

export function groupBy<K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V[]> {
  const map = new Map<K, V[]>();
  for (const item of list) {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (collection) {
      collection.push(item);
    } else {
      map.set(key, [item]);
    }
  }
  return map;
}
