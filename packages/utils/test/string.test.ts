import { describe, expect, test } from "vitest";
import { camel2snake, camelize, capitalizeFirst, cutString, hyphenate, snake2camel } from "../src";
import { getRandomString } from "../src/getRandomString";

describe.concurrent("Test valid is", () => {
  test("Should get the right length string", () => {
    expect(getRandomString(10)).toHaveLength(10);
    expect(getRandomString(20)).toHaveLength(20);
    expect(getRandomString(3)).toHaveLength(3);
  });

  test("Should return camel value", () => {
    expect(camelize("hello-world")).toEqual("helloWorld");
    expect(camelize("hello-world-1")).toEqual("helloWorld1");
    expect(camelize("_hello-world-1-2")).toEqual("_helloWorld12");
  });

  test("Should return capitalize value", () => {
    expect(capitalizeFirst("hello world")).toEqual("Hello world");
    expect(capitalizeFirst("_hello world 1")).toEqual("_hello world 1");
  });

  test("Should return hyphenate value", () => {
    expect(hyphenate("helloWorld")).toEqual("hello-world");
    expect(hyphenate("helloWorld1")).toEqual("hello-world1");
    expect(hyphenate("_helloWorld12")).toEqual("_hello-world12");
  });

  test("Should return snake2camel value", () => {
    expect(snake2camel("hello_world")).toEqual("helloWorld");
    expect(snake2camel("hello_world_1")).toEqual("helloWorld_1");
    expect(snake2camel("_hello_world_xX12")).toEqual("HelloWorldXX12");
  });

  test("Should return camel to snake case value", () => {
    expect(camel2snake("helloWorld")).toEqual("hello_world");
    expect(camel2snake("helloWorld1")).toEqual("hello_world_1");
    expect(camel2snake("HelloWorldXX12")).toEqual("_hello_world_x_x_1_2");
  });

  test("Should cut string value like expect", () => {
    expect(cutString("helloWorld", 3)).toEqual("hel");
    expect(cutString("helloWorld1", 4)).toEqual("hell");
    expect(cutString("HelloWorldXX12", 5)).toEqual("Hello");
    // @ts-expect-error Expect typing error
    expect(cutString(undefined, 9)).toEqual(undefined);
    expect(cutString("", 9)).toEqual("");
  });
});
