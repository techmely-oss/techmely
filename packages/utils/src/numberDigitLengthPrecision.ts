import type { EntityId } from "@techmely/types";

/**
 *  Number precision: Return digits length of a number.
 *
 * @param num The input number
 */
export function digitLengthPrecision(num: EntityId): number {
  // Get digit length of e
  const eSplit = num.toString().split(/[eE]/);
  const len = (eSplit[0].split(".")[1] || "").length - +(eSplit[1] || 0);
  return len > 0 ? len : 0;
}
