import { describe, expect, it } from "vitest";
import { pick } from "../src/pick";

describe("Pick", () => {
  const data = [
    // pick single path
    [
      {
        ignored: "fake",
        outer1: { inner1: "mock", inner2: "mock2", inner3: "mock3" },
        outer2: "outer",
      },
      "outer1.inner1",
      "mock",
    ],
    [
      {
        outer1: {
          inner1: "mock",
          nested: {
            nested1: {
              nested2: "nested2",
            },
          },
        },
      },
      "outer1.nested.nested1.nested2",
      "nested2",
    ],
    [
      {
        ignored: "fake",
        outer1: { inner1: "mock", inner2: "mock2", inner3: "mock3" },
        outer2: "outer",
      },
      "not.defined.yet",
      undefined,
    ],

    /// pick multiple paths
    [{ name: "John", age: 30 }, [], {}],
    [
      {},
      ["name", "age"],
      {
        name: undefined,
        age: undefined,
      },
    ],
    [{ name: "John", age: 30, city: "New York" }, ["name", "age"], { name: "John", age: 30 }],
    [
      { name: "John", age: 30 },
      ["city", "occupation", "age"],
      {
        city: undefined,
        occupation: undefined,
        age: 30,
      },
    ],
    // picks nested properties
    [
      {
        ignored: "fake",
        outer1: { inner1: "mock", inner2: "mock2", inner3: "mock3" },
        outer2: "outer",
      },
      ["outer1.inner1", "outer1.inner2", "outer2"],
      {
        outer1: { inner1: "mock", inner2: "mock2" },
        outer2: "outer",
      },
    ],
    [
      {
        outer1: { inner1: "mock", inner2: "mock2", inner3: "mock3" },
        outer2: { nested1: { nested2: "nested2" } },
      },
      ["outer1.inner1", "outer1.inner2", "outer2.nested1", "outer2.nested1.nested2"],
      {
        outer1: { inner1: "mock", inner2: "mock2" },
        outer2: { nested1: { nested2: "nested2" } },
      },
    ],
    // avoids prototype pollution
    [{ date: new Date() }, ["date.__proto__.constructor"], { date: {} }],
    // creates paths for undefined values
    [{ ignore: "mock" }, ["not.defined.yet"], { not: { defined: { yet: undefined } } }],
  ];

  // @ts-expect-error Ignore type checks
  it.concurrent.each(data)("picks object with %s", (object, paths, expected) => {
    // @ts-expect-error Ignore type checks
    expect(pick(object, paths)).toStrictEqual(expected);
  });
});
