import { describe, expect, it } from "vitest";
import { normalize } from "../src/normalizeArray";
import { take } from "../src/take";
import { unique } from "../src/uniqueArray";
import { uniqueObj } from "../src/uniqueObject";

describe("Array utils test", () => {
  describe("Unique array", () => {
    it("Should return array without any duplicate element", () => {
      expect(unique([10, 10, 20, 30, 30, 40])).toEqual([10, 20, 30, 40]);
    });
  });

  describe("Unique array object", () => {
    type Sample = {
      id: number;
      content: string;
    };
    const samples: Sample[] = [
      { id: 1, content: "Hello" },
      { id: 2, content: "World" },
      { id: 3, content: "Hello World" },
      { id: 4, content: "Hello World" },
    ];

    it("Should return the same array when not duplicate any ID", () => {
      expect(uniqueObj(samples, "id")).toStrictEqual(samples);
    });
    it("Should omit the 4th item in the array when duplicate content", () => {
      expect(uniqueObj(samples, "content")).toStrictEqual([
        { id: 1, content: "Hello" },
        { id: 2, content: "World" },
        { id: 3, content: "Hello World" },
      ]);
    });
  });

  describe("Take array", () => {
    it("Should return new array without slice", () => {
      expect(take([10, 10, 20, 30, 30, 40], 2)).toEqual([10, 10]);
      expect(take([10, 10, 20, 30, 30, 40], 4)).toEqual([10, 10, 20, 30]);
    });
  });

  describe("Normalize array", () => {
    const dataset = [
      [
        [
          { id: 1, name: "HelloKitty", description: "OK" },
          { id: 2, name: "Doraemon", description: "WOW" },
        ],
        "id",
        {
          1: { id: 1, name: "HelloKitty", description: "OK" },
          2: { id: 2, name: "Doraemon", description: "WOW" },
        },
      ],
      [
        [{ id: 1, name: "HelloKitty", description: "OK" }],
        "id",
        {
          1: { id: 1, name: "HelloKitty", description: "OK" },
        },
      ],
      [[{ id: 1, name: "HelloKitty", description: "OK" }], "not-in-object", {}],
      [[], "not-in-object", {}],
    ];
    it.concurrent.each(dataset)(
      "Should normalize array %s with key %s will return new object %s",
      // @ts-expect-error Expect type error
      (data, key, expected) => {
        // @ts-expect-error Expect type error
        expect(normalize(data, key)).toStrictEqual(expected);
      },
    );
  });
});
