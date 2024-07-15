import { describe, expect, it } from "vitest";
import { camel2SnakeObject } from "../src/camel2SnakeObject";
import { mergeDeep } from "../src/mergeDeep";

describe("Object test", () => {
  describe("mergeDeep", () => {
    it("should merge Objects and all nested Ones", () => {
      const obj1 = { a: { a1: "A1" }, c: "C", d: {} };
      const obj2 = { a: { a2: "A2" }, b: { b1: "B1" }, d: null } as any;
      const obj3 = {
        a: { a1: "A1", a2: "A2" },
        b: { b1: "B1" },
        c: "C",
        d: null,
      };
      expect(mergeDeep({}, obj1, obj2)).toEqual(obj3);
    });
    it("should behave like Object.assign on the top level", () => {
      const obj1 = { a: { a1: "A1" }, c: "C" };
      const obj2 = { a: undefined, b: { b1: "B1" } };
      const merged = mergeDeep(obj1, obj2);
      expect(merged).toEqual({ ...obj1, ...obj2 });
    });
    it("should not merge array values, just override", () => {
      const obj1 = { a: ["A", "B"] };
      const obj2 = { a: ["C"], b: ["D"] };
      expect(mergeDeep({}, obj1, obj2)).toEqual({ a: ["C"], b: ["D"] });
    });
    it("should override plain value", () => {
      const obj1 = { a: { x: 1 } };
      const obj2 = { a: { x: { f: 2 } } } as any;
      expect(mergeDeep({}, obj1, obj2)).toEqual({ a: { x: { f: 2 } } });
    });
  });
  describe("Camel case object to snake case object", () => {
    it("Should transform correctly", () => {
      const obj1 = { abc: 1, helloWorld: "ok", nani1: "LOL", ohmy11God: "ohmy11God" };
      const obj2 = { abc: 1, hello_world: "ok", nani_1: "LOL", ohmy_1_1_god: "ohmy11God" };
      const result = camel2SnakeObject(obj1);
      expect(result).toEqual(obj2);
    });
  });
});
