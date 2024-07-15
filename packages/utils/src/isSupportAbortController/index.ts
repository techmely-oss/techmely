export function isSupportsAbortController() {
  return typeof globalThis.AbortController === "function";
}
