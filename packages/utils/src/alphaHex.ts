import type { ComputeRange } from "@techmely/types";
import { percentToHex } from "./percentToHex";

const HEX_LENGTH = 6;
const HEX_OPACITY_LENGTH = 8;

export function alphaHex(hex: string, alpha: ComputeRange<MAXIMUM_ALLOWED_BOUNDARY>[number]) {
  if (!hex) {
    throw new Error("Hex value is required");
  }
  if (hex.length === HEX_OPACITY_LENGTH) {
    return `${hex.slice(0, HEX_LENGTH)}${percentToHex(alpha)}`;
  }
  return `${hex}${percentToHex(alpha)}`;
}

type MAXIMUM_ALLOWED_BOUNDARY = 101;
