import type { EntityId, NullList, UnDef } from "@techmely/types";
import { isNumber } from "./isNumber";

/**
 *
 * @param num
 * @param precision
 * @param defaultValue
 * @returns
 */
export function formatNumber(
  num: NullList<EntityId>,
  precision = 0,
  defaultValue: UnDef<EntityId> = "-",
) {
  if (!isNumber(num)) {
    return defaultValue;
  }
  return num.toLocaleString("en", {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}
