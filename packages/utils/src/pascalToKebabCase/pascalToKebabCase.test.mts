import { expect, test } from "vitest";
import { pascalToKebabCase } from ".";

test("Should return kebab case value", () => {
  expect(pascalToKebabCase("HelloWorld")).toEqual("hello-world");
  expect(pascalToKebabCase("HelloWorld1")).toEqual("hello-world1");
  expect(pascalToKebabCase("_HelloWorld")).toEqual("-hello-world");
});
