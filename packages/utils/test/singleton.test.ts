import { describe, expect, test } from "vitest";
import { singleton } from "../src/singleton";

describe.concurrent("Test inject something on global app", () => {
  test("Should inject something", () => {
    const hello = singleton("hello", () => "Hello world");
    expect(global.__singletons.hello).toBe(hello);
  });
});
