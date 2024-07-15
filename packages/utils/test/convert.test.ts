import { describe, expect, it } from "vitest";
import { convertHrTime } from "../src/convertHrTime";

describe("Convert hr-time", () => {
  it("Should convert correctly", () => {
    const start = process.hrtime.bigint();
    const diff = convertHrTime(process.hrtime.bigint() - start);
    expect(typeof diff.seconds).toBe("number");
    expect(typeof diff.milliseconds).toBe("number");
    expect(typeof diff.nanoseconds).toBe("bigint");
  });
});
