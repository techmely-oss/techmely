import { windowMatchMedia } from "./matchMedia";

/** Tells if the user has enabled the "reduced motion" setting in their browser or OS. */
export function isPrefersReducedMotion() {
  const mediaQuery = windowMatchMedia()?.("(prefers-reduced-motion: reduce)");
  return typeof window !== "undefined" ? mediaQuery?.matches : false;
}
