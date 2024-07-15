// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { sleep } from "../src/sleep";
import { timeSpanBr } from "../src/timeSpanBr";

describe("Time span", () => {
  it("Should check correctly", async () => {
    const time = timeSpanBr();
    await sleep(100);
    expect(time()).toBeGreaterThanOrEqual(80);
    expect(time()).toBeLessThanOrEqual(120);
  });
});
