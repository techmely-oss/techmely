import { invariant } from "../invariant";

/**
 * Replaces all but the last num of characters with the specified mask character.
 * example:
 *  mask(1234567890); // '******7890'
    mask(1234567890, 3); // '*******890'
    mask(1234567890, -4, '$'); // '$$$$567890'
 */
export function mask(cc: number | string, num = 4, mask = "*") {
  invariant(cc);
  return `${cc}`.slice(-num).padStart(`${cc}`.length, mask);
}
