import { describe, expect, it } from "vitest";
import { sleep } from "../src/sleep";
import { timeSpan } from "../src/timeSpan";

describe("Time span", () => {
  it("Should check correctly", async () => {
    const time = timeSpan();
    await sleep(100);
    expect(time()).toBeGreaterThanOrEqual(80);
    expect(time()).toBeLessThanOrEqual(120);
  });
});
