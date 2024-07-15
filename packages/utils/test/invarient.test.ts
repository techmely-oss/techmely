import { describe, expect, it, vi } from "vitest";
import { invariant } from "../src/invariant";

describe("Test invariant", () => {
  it("should not throw if condition is truthy", () => {
    const truthy: unknown[] = [1, -1, true, {}, [], Symbol(), "hi"];
    for (const value of truthy) {
      expect(() => invariant(value)).not.toThrow();
    }
  });

  it("should throw if the condition is falsy", () => {
    // https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md#falsy-values
    const falsy: unknown[] = [undefined, null, false, +0, -0, Number.NaN, ""];
    for (const value of falsy) {
      expect(() => invariant(value)).toThrow();
    }
  });

  it("should include a default message when an invariant does throw and no message is provided", () => {
    try {
      invariant(false);
    } catch (e) {
      invariant(e instanceof Error);
      expect(e.message).toEqual("Invariant failed");
    }
  });

  it("should include a provided message when an invariant does throw", () => {
    try {
      invariant(false, "my message");
    } catch (e) {
      invariant(e instanceof Error);
      expect(e.message).toEqual("Invariant failed: my message");
    }
  });

  it("should not execute a message function if the invariant does not throw", () => {
    const message = vi.fn(() => "lazy message");
    invariant(true, message);
    expect(message).not.toHaveBeenCalled();
  });

  it("should execute a message function if the invariant does throw", () => {
    const message = vi.fn(() => "lazy message");
    try {
      invariant(false, message);
    } catch (e) {
      invariant(e instanceof Error);
      expect(message).toHaveBeenCalled();
      expect(e.message).toEqual("Invariant failed: lazy message");
    }
  });
  it("should execute an error class if the invariant does throw", () => {
    const TError = new Error("Custom error class");
    try {
      invariant(false, TError);
    } catch (e) {
      invariant(e instanceof Error);
      expect(e.message).toEqual("Custom error class");
    }
  });
});
