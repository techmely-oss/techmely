import { describe, expect } from "vitest";
import { ranking } from ".";

describe("Check ranking func", () => {
  expect(ranking([8, 6, 9, 5], (a, b) => a < b)).toStrictEqual([2, 3, 1, 4]);

  expect(ranking(["c", "a", "b", "d"], (a, b) => a.localeCompare(b) > 0)).toStrictEqual([
    3, 1, 2, 4,
  ]);
});
