import { describe, expect, test } from "vitest";
import { flattenObject } from ".";

describe("Flatten Object", () => {
  test("Flattens a simple object", () => {
    const obj = {
      a: 1,
      b: 2,
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  test("Flattens a nested object", () => {
    const obj = {
      a: {
        b: 2,
        c: 3,
      },
      d: 4,
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ "a.b": 2, "a.c": 3, d: 4 });
  });

  test("Flattens a deeply nested object", () => {
    const obj = {
      a: {
        b: {
          c: 3,
          d: {
            e: 5,
          },
        },
      },
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ "a.b.c": 3, "a.b.d.e": 5 });
  });

  test("Flattens an object with arrays", () => {
    const obj = {
      a: [1, 2],
      b: {
        c: [3, 4],
      },
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ a: [1, 2], "b.c": [3, 4] });
  });

  test("Flattens an object with empty values", () => {
    const obj = {
      a: null,
      b: undefined,
      c: "",
    };
    const result = flattenObject(obj);
    expect(result).toEqual({ a: null, b: undefined, c: "" });
  });
});
