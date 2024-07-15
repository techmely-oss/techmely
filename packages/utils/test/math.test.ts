import { expect, it } from "vitest";
import { sum } from "../src";

it("Calculate sum", () => {
  expect(sum(1, 2, 3)).toEqual(6);
  expect(sum([1, 2, 3])).toEqual(6);
  expect(sum([1], [2, 3])).toEqual(6);

  // @ts-expect-error Bcs the type of args can be number [][]
  expect(sum(1, 2, [1, 2, 3])).toEqual(9);
});
