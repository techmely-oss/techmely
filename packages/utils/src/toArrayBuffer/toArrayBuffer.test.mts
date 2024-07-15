import { describe, expect, test } from "vitest";
import { toArrayBuffer } from ".";

describe("toArrayBuffer", () => {
  test("should convert a Buffer to an ArrayBuffer with the same content", () => {
    const buffer = Buffer.from("Hello, World!");
    const arrayBuffer = toArrayBuffer(buffer);
    const view = new Uint8Array(arrayBuffer);

    // Check that the lengths are the same
    expect(arrayBuffer.byteLength).toBe(buffer.length);

    // Check that the content is the same
    for (let i = 0; i < buffer.length; i++) {
      expect(view[i]).toBe(buffer[i]);
    }
  });

  test("should return an empty ArrayBuffer when given an empty Buffer", () => {
    const buffer = Buffer.alloc(0);
    const arrayBuffer = toArrayBuffer(buffer);

    // Check that the ArrayBuffer is empty
    expect(arrayBuffer.byteLength).toBe(0);
  });

  test("should handle non-ASCII characters correctly", () => {
    const buffer = Buffer.from("こんにちは世界"); // "Hello, World!" in Japanese
    const arrayBuffer = toArrayBuffer(buffer);
    const view = new Uint8Array(arrayBuffer);

    // Check that the lengths are the same
    expect(arrayBuffer.byteLength).toBe(buffer.length);

    // Check that the content is the same
    for (let i = 0; i < buffer.length; i++) {
      expect(view[i]).toBe(buffer[i]);
    }
  });
});
