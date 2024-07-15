import { describe, expect, test } from "vitest";
import { toNumber } from ".";

describe("toNumber()", () => {
  test("should return null", () => {
    const isNotOk = toNumber("null");
    expect(isNotOk).toBe("null");
  });
  test("should return number", () => {
    const number = toNumber("69");
    expect(number).toBe(69);
  });
});
