import type { EntityId, NullList, UnDef } from "@techmely/types";
import { isNumber } from "./isNumber";

/**
 *
 * @param volume
 * @param precision
 * @param defaultValue
 * @returns
 */
export function formatLot10Volume(
  volume: NullList<EntityId>,
  precision = 0,
  defaultValue: UnDef<EntityId> = "-",
) {
  if (!isNumber(volume)) {
    return defaultValue;
  }
  return (volume * 10)?.toLocaleString("en", { minimumFractionDigits: precision }).slice(0, -1);
}
