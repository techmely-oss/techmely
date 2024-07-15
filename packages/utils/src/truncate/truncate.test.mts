import { expect, test } from "vitest";
import { truncate } from ".";

test("Should return kebab case value", () => {
  expect(truncate("HelloWorld", 5)).toEqual("Hello ...");
  expect(truncate("HelloWorld1", 10)).toEqual("HelloWorld ...");
  expect(truncate("_HelloWorld", 100)).toEqual("_HelloWorld");
});
