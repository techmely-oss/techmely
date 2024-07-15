import { randomInt } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateId, generatePrefixId } from "../src/id";

describe("Test generate ID", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("ids are k-sorted by time", () => {
    const testCases = [
      {
        k: 2,
        n: 1_000,
      },
      {
        k: 10,
        n: 10_000,
      },
    ];

    for (const tc of testCases) {
      it(`k: ${tc.k}, n: ${tc.n}`, () => {
        const ids = new Array(tc.n).fill(null).map((_, i) => {
          vi.setSystemTime(new Date(i * 10));
          return generateId();
        });
        const sorted = [...ids].sort();

        for (let i = 0; i < ids.length; i++) {
          expect(Math.abs(ids.indexOf(sorted[i]) - i)).toBeLessThanOrEqual(tc.k);
        }
      });
    }
  });

  it("suffix length is between 26-28 characters long", () => {
    for (let i = 0; i < 100_000; i++) {
      vi.setSystemTime(new Date(randomInt(281474976710655)));

      const suffix = generatePrefixId("key").split("_")[1];
      expect(suffix.length).toBeGreaterThanOrEqual(26);
      expect(suffix.length).toBeLessThanOrEqual(28);
    }
  });
});
