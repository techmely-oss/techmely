import { checkBoundaryPrecision } from "./numberBoundaryStatePrecision";
import { createOperationPrecision } from "./numberCreateOperationPrecision";
import { digitLengthPrecision } from "./numberDigitLengthPrecision";
import { float2FixedPrecision } from "./numberFloat2FixedPrecision";

/**
 * Number precision: Accurate multiplication.
 *
 * @param nums The numbers to multiply
 */
export const timesPrecision = createOperationPrecision((num1, num2) => {
  const num1Changed = float2FixedPrecision(num1);
  const num2Changed = float2FixedPrecision(num2);
  const baseNum = digitLengthPrecision(num1) + digitLengthPrecision(num2);
  const leftValue = num1Changed * num2Changed;

  checkBoundaryPrecision(leftValue);
  const baseNumPow = 10 ** baseNum;
  return leftValue / baseNumPow;
});
