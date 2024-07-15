import { describe, expect, test } from "vitest";
import { haveSameElement } from ".";

describe("haveSameElement()", () => {
  const array1 = [1, 2, 3, 0, 213, -123];
  test("should return true", () => {
    const array2 = [4, 6, 9, 1231, 122, 213];
    expect(haveSameElement(array1, array2)).toBe(true);
  });
  test("should return false", () => {
    const array2 = [4, 6, 9, 1231, 122, -213];
    expect(haveSameElement(array1, array2)).toBe(false);
  });

  test("should return true with enum", () => {
    enum UserRole {
      GUEST = "GUEST",
      USER = "USER",
      ADMIN = "ADMIN",
      SUPER_ADMIN = "SUPER_ADMIN",
    }

    const roles1 = [UserRole.USER, UserRole.ADMIN];
    const roles2 = [UserRole.USER, UserRole.SUPER_ADMIN];
    expect(haveSameElement(roles1, roles2)).toBe(true);
  });
});
