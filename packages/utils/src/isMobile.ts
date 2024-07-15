import { windowMatchMedia } from "./matchMedia";

export function isMobile() {
  return typeof window !== "undefined" ? windowMatchMedia()?.("(pointer:coarse)")?.matches : false;
}
