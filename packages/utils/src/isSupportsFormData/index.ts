export function isSupportsFormData() {
  return typeof globalThis.FormData === "function";
}
