import { describe, expect, test } from "vitest";
import { isDeepEqual } from ".";

describe("isDeepEqual()", () => {
  const obj1 = { a: 1, b: { c: 2 } };
  test("should return true", () => {
    const obj2 = { a: 1, b: { c: 2 } };
    expect(isDeepEqual(obj1, obj2)).toBe(true);
  });
  test("should return false", () => {
    const obj3 = { a: 1, b: { c: 3 } };
    expect(isDeepEqual(obj1, obj3)).toBe(false);
  });
});
