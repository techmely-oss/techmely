import { describe, expect, test } from "vitest";
import { isNullOrUndefined } from ".";

describe("isNullOrUndefined()", () => {
  test("should return null", () => {
    const isNull = isNullOrUndefined(null);
    expect(isNull).toBe(true);
  });
  test("should return undefined", () => {
    const isUndef = isNullOrUndefined(undefined);
    expect(isUndef).toBe(true);
  });
  test("should return value", () => {
    const isUndef = isNullOrUndefined(1);
    expect(isUndef).toBe(false);
  });
});
