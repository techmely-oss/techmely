/**
 * Transform an integer into its hexadecimal value
 *
 * @param {number | bigint} integer the input value
 * @returns {string} the hexadecimal value after convert
 */
export function intToHex(integer: number | bigint): string {
  if (integer < 0) {
    throw new Error("Invalid integer as argument, must be unsigned!");
  }
  const hex = integer.toString(16);
  return hex.length % 2 ? `0${hex}` : hex;
}
