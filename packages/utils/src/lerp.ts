/**
 *
 * @param {number} y1 -
 * @param {number} y2 -
 * @param {number} mu -
 * @returns {number} - the lerp
 */
export function lerp(y1: number, y2: number, mu: number): number {
  return y1 * (1 - mu) + y2 * mu;
}
