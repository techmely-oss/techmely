export function isSupportsResponseStreams() {
  return typeof globalThis.ReadableStream === "function";
}
