import { describe, expect, test } from "vitest";
import { filterArrays } from ".";

describe("filterArrays function", () => {
  test("filters out only the items that match the condition", () => {
    const arr1 = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, title: `Title ${i + 1}` }));
    const arr2 = "abcdefghij".split("");
    const result = filterArrays(arr1, arr2, (a, b) => a.title.toLowerCase().includes(b));
    expect(result).toHaveLength(10);
    expect(result).toEqual([
      {
        id: 1,
        title: "Title 1",
      },
      {
        id: 2,
        title: "Title 2",
      },
      {
        id: 3,
        title: "Title 3",
      },
      {
        id: 4,
        title: "Title 4",
      },
      {
        id: 5,
        title: "Title 5",
      },
      {
        id: 6,
        title: "Title 6",
      },
      {
        id: 7,
        title: "Title 7",
      },
      {
        id: 8,
        title: "Title 8",
      },
      {
        id: 9,
        title: "Title 9",
      },
      {
        id: 10,
        title: "Title 10",
      },
    ]);
  });

  test("returns an empty array when no items match", () => {
    const arr1 = Array.from({ length: 15 }, (_, i) => ({ id: i + 1, title: `Title ${i + 1}` }));
    const arr2 = ["z", "x", "y"];
    const result = filterArrays(arr1, arr2, (a, b) => a.title.toLowerCase().includes(b));
    expect(result).toHaveLength(0);
  });

  test("returns all items when all match the condition", () => {
    const arr1 = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, title: `Title ${i + 1}` }));
    const arr2 = ["title"];
    const result = filterArrays(arr1, arr2, (a, b) => a.title.toLowerCase().includes(b));
    expect(result).toHaveLength(20);
  });

  test("is case insensitive", () => {
    const arr1 = Array.from({ length: 12 }, (_, i) => ({ id: i + 1, title: `Title ${i + 1}` }));
    const arr2 = ["TITLE"];
    const result = filterArrays(arr1, arr2, (a, b) =>
      a.title.toLowerCase().includes(b.toLowerCase()),
    );
    expect(result).toHaveLength(12);
  });

  test("works with different data types", () => {
    const arr1 = Array.from({ length: 18 }, (_, i) => i + 1);
    const arr2 = [2, 4, 6, 8];
    const result = filterArrays(arr1, arr2, (a, b) => a % b === 0);
    expect(result).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18]);
  });
});
