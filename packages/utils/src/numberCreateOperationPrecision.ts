import type { EntityId } from "@techmely/types";

/**
 * Create an operation to support rest params.
 *
 * @param operation The original operation
 */
export function createOperationPrecision(
  operation: (n1: EntityId, n2: EntityId) => number,
): (...nums: EntityId[]) => number {
  return (...nums: EntityId[]) => {
    const [first, ...others] = nums;
    return others.reduce((prev, next) => operation(prev, next), first) as number;
  };
}
