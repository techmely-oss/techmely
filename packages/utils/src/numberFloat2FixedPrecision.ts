import type { EntityId } from "@techmely/types";
import { digitLengthPrecision } from "./numberDigitLengthPrecision";
import { stripPrecision } from "./numberStripPrecision";

/**
 *  Number precision: Convert the given number to integer, support scientific notation.
 * The number will be scale up if it is decimal.
 *
 * @param num The input number
 */
export function float2FixedPrecision(num: EntityId): number {
  if (num.toString().indexOf("e") === -1) {
    return Number(num.toString().replace(".", ""));
  }
  const dLen = digitLengthPrecision(num);
  const powDLen = 10 ** dLen;
  return dLen > 0 ? stripPrecision(Number(num) * powDLen) : Number(num);
}
