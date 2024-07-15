import { describe, expect } from "vitest";
import { removeWhitespace } from ".";

describe("Check remove Whitespace func", () => {
  expect(removeWhitespace("Hello World ! ")).toBe("HelloWorld!");
  expect(removeWhitespace(" Hello  World ! ")).toBe("HelloWorld!");
  expect(removeWhitespace("Hello   World  ! ")).toBe("HelloWorld!");
  expect(removeWhitespace("Hello       World        ! ")).toBe("HelloWorld!");
});
