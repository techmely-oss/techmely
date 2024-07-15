import { createOperationPrecision } from "./numberCreateOperationPrecision";
import { digitLengthPrecision } from "./numberDigitLengthPrecision";
import { timesPrecision } from "./numberTimesPrecision";

/**
 * Number precision: Accurate subtraction.
 *
 * @param nums The numbers to subtract
 */
export const minusPrecision = createOperationPrecision((num1, num2) => {
  const baseNum = 10 ** Math.max(digitLengthPrecision(num1), digitLengthPrecision(num2));
  return (timesPrecision(num1, baseNum) - timesPrecision(num2, baseNum)) / baseNum;
});
