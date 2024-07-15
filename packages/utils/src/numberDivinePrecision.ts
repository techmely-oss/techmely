import { checkBoundaryPrecision } from "./numberBoundaryStatePrecision";
import { createOperationPrecision } from "./numberCreateOperationPrecision";
import { digitLengthPrecision } from "./numberDigitLengthPrecision";
import { float2FixedPrecision } from "./numberFloat2FixedPrecision";
import { stripPrecision } from "./numberStripPrecision";
import { timesPrecision } from "./numberTimesPrecision";

/**
 * Number precision: Accurate division.
 *
 * @param nums The numbers to divide
 */
export const dividePrecision = createOperationPrecision((num1, num2) => {
  const num1Changed = float2FixedPrecision(num1);
  const num2Changed = float2FixedPrecision(num2);

  checkBoundaryPrecision(num1Changed);
  checkBoundaryPrecision(num2Changed);

  // fix: Something like 10 ** -4 is 0.00009999999999999999, strip corrected
  return timesPrecision(
    num1Changed / num2Changed,
    stripPrecision(10 ** (digitLengthPrecision(num2) - digitLengthPrecision(num1))),
  );
});
