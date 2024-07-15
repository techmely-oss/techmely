/**
 * Shuffle an array. This function mutates the array.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const factor = Math.floor(Math.random() * (i + 1));
    [array[i], array[factor]] = [array[factor], array[i]];
  }
  return array;
}
