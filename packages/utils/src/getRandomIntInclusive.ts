/**
 * @description Get random number
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values}
 * @param {number} min - Input min number
 * @param {number} max - Input max number
 * @returns {number} - The random number
 */
export function getRandomIntInclusive(min: number, max: number): number {
  const _min = Math.ceil(min);
  const _max = Math.floor(max);
  return Math.floor(Math.random() * (_max - _min + 1) + _min); //The maximum is inclusive and the minimum is inclusive
}
