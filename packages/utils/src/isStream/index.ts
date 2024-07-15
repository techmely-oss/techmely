import type { Readable } from "node:stream";

/**
 * Checks if the data is a stream. (Node.js Readable Stream, React Pipeable Stream, or Web Stream)
 */
export function isStream(value: any): value is Readable | ReadableStream {
  if (!value || typeof value !== "object") {
    return false;
  }
  if (typeof value.pipe === "function") {
    // Node.js Readable Streams
    if (typeof value._read === "function") {
      return true;
    }
    // React Pipeable Streams
    if (typeof value.abort === "function") {
      return true;
    }
  }
  // Web Streams
  if (typeof value.pipeTo === "function") {
    return true;
  }
  return false;
}
