import type { ComputeRange } from "@techmely/types";

type MAXIMUM_ALLOWED_BOUNDARY = 101;

/**
 * Transform an integer into a hex --> The opacity
 *
 * @param {number} percent the input value
 * @returns {string} The hex decimal
 */
export function percentToHex(percent: ComputeRange<MAXIMUM_ALLOWED_BOUNDARY>[number]): string {
  if (percent < 0 || percent > 100) {
    throw new Error("Value must in range [0, 100]");
  }

  const intValue = Math.round((percent / 100) * 255); // map percent to nearest integer (0 - 255)
  const hexValue = intValue.toString(16); // get hexadecimal representation
  return hexValue.padStart(2, "0").toUpperCase(); // format with leading 0 and upper case characters
}
